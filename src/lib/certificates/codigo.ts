const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCertCode(): string {
  const year = new Date().getFullYear();
  const random = Array.from(
    { length: 6 },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join("");
  return `PULSAR-${year}-${random}`;
}
