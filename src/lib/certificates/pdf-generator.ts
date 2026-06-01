import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { promises as fs } from "fs";
import path from "path";

export type CertPdfData = {
  codigo: string;
  nome_aluno: string;
  nome_empresa: string;
  local: string;
  duracao: string;
  data_evento: string | null;
  validation_url: string;
};

// ═══════════════════════════════════════════════════════
// POSIÇÕES DOS CAMPOS (em pontos PDF, 1pt = 1/72")
// Sistema de coordenadas: ORIGEM no canto INFERIOR-ESQUERDO
// Pra mover algo "pra cima", AUMENTA Y. "Pra direita", AUMENTA X.
// A4 paisagem padrão: 842 x 595 pts
// ═══════════════════════════════════════════════════════

const POSITIONS = {
  // Nome do participante — grande, centralizado
  nome_aluno: { y: 320, fontSize: 32, align: "center" as const },

  // Nome do treinamento/empresa
  nome_empresa: { y: 240, fontSize: 16, align: "center" as const },

  // Linha de detalhes (local · carga horária · data)
  detalhes: { y: 210, fontSize: 11, align: "center" as const },

  // Código de validação (rodapé esquerda)
  codigo: { x: 60, y: 50, fontSize: 9 },

  // URL de validação (logo abaixo do código)
  validacaoUrl: { x: 60, y: 38, fontSize: 7 },

  // QR Code (rodapé direita)
  qrCode: { x: 720, y: 30, size: 80 },
};

function formatDateLong(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function fillCertificatePdf(
  data: CertPdfData,
): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public", "Certificado.pdf");
  const templateBytes = await fs.readFile(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPage(0);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── Helper pra desenhar texto com alinhamento
  function drawText(
    text: string,
    cfg: { x?: number; y: number; fontSize: number; align?: "center" | "left" },
    font = fontRegular,
    color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 },
  ) {
    if (!text) return;
    const textWidth = font.widthOfTextAtSize(text, cfg.fontSize);
    let x: number;
    if (cfg.align === "center") {
      x = (width - textWidth) / 2;
    } else {
      x = cfg.x ?? 60;
    }
    page.drawText(text, {
      x,
      y: cfg.y,
      size: cfg.fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }

  // ─── Nome do aluno (grande, bold, dourado)
  drawText(data.nome_aluno, POSITIONS.nome_aluno, fontBold, {
    r: 0.76,
    g: 0.45,
    b: 0.04, // gold #c2740a
  });

  // ─── Nome da empresa/treinamento
  drawText(data.nome_empresa, POSITIONS.nome_empresa, fontBold);

  // ─── Linha de detalhes
  const detalhesParts: string[] = [];
  if (data.local) detalhesParts.push(data.local);
  if (data.duracao) detalhesParts.push(`Carga horária: ${data.duracao}`);
  if (data.data_evento)
    detalhesParts.push(formatDateLong(data.data_evento));
  const detalhes = detalhesParts.join("  ·  ");
  drawText(detalhes, POSITIONS.detalhes, fontRegular, {
    r: 0.3,
    g: 0.3,
    b: 0.3,
  });

  // ─── Código de validação (rodapé)
  drawText(
    `Código: ${data.codigo}`,
    { x: POSITIONS.codigo.x, y: POSITIONS.codigo.y, fontSize: POSITIONS.codigo.fontSize },
    fontBold,
    { r: 0.4, g: 0.4, b: 0.4 },
  );
  drawText(
    `Validar em: ${data.validation_url}`,
    {
      x: POSITIONS.validacaoUrl.x,
      y: POSITIONS.validacaoUrl.y,
      fontSize: POSITIONS.validacaoUrl.fontSize,
    },
    fontRegular,
    { r: 0.5, g: 0.5, b: 0.5 },
  );

  // ─── QR Code (gera PNG, embeda no PDF)
  try {
    const qrPng = await QRCode.toBuffer(data.validation_url, {
      type: "png",
      margin: 0,
      width: 200,
      color: { dark: "#000000", light: "#ffffff" },
    });
    const qrImage = await pdfDoc.embedPng(qrPng);
    page.drawImage(qrImage, {
      x: POSITIONS.qrCode.x,
      y: POSITIONS.qrCode.y,
      width: POSITIONS.qrCode.size,
      height: POSITIONS.qrCode.size,
    });
  } catch (err) {
    console.error("Erro gerando QR:", err);
  }

  return pdfDoc.save();
}
