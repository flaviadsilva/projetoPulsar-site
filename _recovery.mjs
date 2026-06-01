// Recovery script: reconstructs project files from Claude Code JSONL transcript.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const JSONL = String.raw`C:\Users\Arthu Biehl\.claude\projects\C--Users-Arthu-Biehl-Documents-workplace-ProjetoJU\06e30c48-68ec-4ed7-bec2-2d0fc44b3576.jsonl`;
const ROOT = String.raw`C:\Users\Arthu Biehl\Documents\workplace\ProjetoJU`;

const files = new Map(); // path -> content
const reads = new Set();
const failedEdits = [];
let writes = 0, edits = 0, editFails = 0;

function norm(p) {
  if (!p) return p;
  // Skip node_modules
  if (/node_modules/i.test(p)) return null;
  // Normalize to absolute under ROOT if relative
  let np = p.replace(/\//g, '\\');
  if (!path.isAbsolute(np)) np = path.join(ROOT, np);
  return np;
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(JSONL, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    const msg = obj.message;
    if (!msg || !Array.isArray(msg.content)) continue;
    for (const block of msg.content) {
      if (block.type !== 'tool_use') continue;
      const name = block.name;
      const input = block.input || {};
      if (name === 'Write') {
        const p = norm(input.file_path);
        if (!p) continue;
        files.set(p, input.content ?? '');
        writes++;
      } else if (name === 'Edit') {
        const p = norm(input.file_path);
        if (!p) continue;
        edits++;
        const cur = files.get(p);
        if (cur == null) {
          // No prior Write captured; we cannot edit a Read-only file (no content)
          failedEdits.push({ path: p, reason: 'no prior Write content', line: lineNo });
          editFails++;
          continue;
        }
        const oldS = input.old_string ?? '';
        const newS = input.new_string ?? '';
        const replaceAll = !!input.replace_all;
        if (replaceAll) {
          if (!cur.includes(oldS)) {
            failedEdits.push({ path: p, reason: 'old_string not found (replace_all)', line: lineNo });
            editFails++;
            continue;
          }
          files.set(p, cur.split(oldS).join(newS));
        } else {
          const idx = cur.indexOf(oldS);
          if (idx === -1) {
            failedEdits.push({ path: p, reason: 'old_string not found', line: lineNo });
            editFails++;
            continue;
          }
          files.set(p, cur.slice(0, idx) + newS + cur.slice(idx + oldS.length));
        }
      } else if (name === 'Read') {
        const p = norm(input.file_path);
        if (p) reads.add(p);
      } else if (name === 'NotebookEdit') {
        // Skip; unlikely for React project
      }
    }
  }

  // Write files to disk
  const restored = [];
  for (const [p, content] of files) {
    try {
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, content, 'utf8');
      const lc = content.split('\n').length;
      restored.push({ path: p, lines: lc });
    } catch (e) {
      failedEdits.push({ path: p, reason: 'write failed: ' + e.message });
    }
  }

  restored.sort((a, b) => a.path.localeCompare(b.path));

  console.log('=== RECOVERY SUMMARY ===');
  console.log(`Writes seen: ${writes}, Edits seen: ${edits}, Edit failures: ${editFails}`);
  console.log(`Files restored: ${restored.length}`);
  console.log(`Reads-only (not restored): ${[...reads].filter(r => !files.has(r)).length}`);
  console.log('\n--- RESTORED FILES ---');
  for (const r of restored) console.log(`${r.lines.toString().padStart(5)}  ${r.path}`);
  if (failedEdits.length) {
    console.log('\n--- FAILED EDITS ---');
    for (const f of failedEdits) console.log(`L${f.line ?? '-'} ${f.reason}: ${f.path}`);
  }

  // Tech stack hint
  const pkgPath = path.join(ROOT, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      console.log('\n--- PACKAGE.JSON ---');
      console.log('name:', pkg.name);
      console.log('deps:', Object.keys(pkg.dependencies || {}).join(', '));
      console.log('devDeps:', Object.keys(pkg.devDependencies || {}).join(', '));
    } catch {}
  }
}

main().catch(e => { console.error(e); process.exit(1); });
