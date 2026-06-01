"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Printer, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type CertificateData = {
  codigo: string;
  nome_aluno: string;
  nome_empresa: string;
  local: string;
  duracao: string;
  data_evento: string | null;
  emitido_em: string;
};

function formatDateLong(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso + "T00:00:00");
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function CertificateView({ cert }: { cert: CertificateData }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [validationUrl, setValidationUrl] = useState(
    `/certificado/${cert.codigo}`,
  );

  // Gera QR code no client
  useEffect(() => {
    const url = `${window.location.origin}/certificado/${cert.codigo}`;
    setValidationUrl(url);

    import("qrcode").then(({ default: QRCode }) => {
      QRCode.toDataURL(url, {
        margin: 0,
        width: 300,
        color: { dark: "#18181b", light: "#ffffff" },
      }).then(setQrDataUrl);
    });
  }, [cert.codigo]);

  async function handleDownloadPdf() {
    if (!certRef.current) return;

    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      pdf.save(`certificado-pulsar-${cert.codigo}.pdf`);

      toast.success("PDF baixado!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar PDF. Tente o botão imprimir.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body * { visibility: hidden !important; }
          .certificate-print, .certificate-print * { visibility: visible !important; }
          .certificate-print {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            width: 297mm !important; height: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Top action bar */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Código de validação
          </p>
          <p className="font-mono text-base font-medium">{cert.codigo}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleDownloadPdf}
            size="lg"
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Baixar PDF
          </Button>
          <Button
            onClick={() => window.print()}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {/* Certificate */}
      <div
        ref={certRef}
        className="certificate-print relative mx-auto flex aspect-[297/210] w-full max-w-5xl flex-col justify-between overflow-hidden bg-white p-12 text-foreground shadow-xl"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {/* Corner brackets (decorativos) */}
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        {/* Watermark sutil ao fundo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 select-none text-[260px] font-bold uppercase leading-none tracking-tighter text-primary/[0.04]"
        >
          Pulsar
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/img/logo.png"
              alt="Projeto Pulsar"
              width={44}
              height={44}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-light uppercase tracking-[0.22em] text-muted-foreground">
                Projeto
              </span>
              <span className="text-lg font-bold tracking-tight">Pulsar</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Certificado oficial
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground/70">
              <span className="size-1 rotate-45 bg-primary" />
              Participação
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Certificado
          </p>
          <h1 className="mt-2 text-7xl font-bold uppercase leading-[0.95] tracking-tight text-primary">
            de Participação
          </h1>

          <div className="my-8 flex items-center gap-3">
            <span className="h-px w-12 bg-foreground/30" />
            <span className="size-1.5 rotate-45 bg-primary" />
            <span className="h-px w-12 bg-foreground/30" />
          </div>

          <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
            Certificamos que
          </p>
          <h2 className="mt-3 text-5xl font-bold tracking-tight text-foreground">
            {cert.nome_aluno}
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80">
            participou do treinamento{" "}
            <strong className="font-bold text-foreground">
              {cert.nome_empresa}
            </strong>
            , realizado em{" "}
            <strong className="font-bold text-foreground">{cert.local}</strong>,
            com carga horária de{" "}
            <strong className="font-bold text-foreground">
              {cert.duracao}
            </strong>
            {cert.data_evento && (
              <>
                , em{" "}
                <strong className="font-bold text-foreground">
                  {formatDateLong(cert.data_evento)}
                </strong>
              </>
            )}
            .
          </p>
        </div>

        {/* Footer: code (left) + signature (center) + QR (right) */}
        <div className="relative z-10 grid grid-cols-3 items-end gap-4">
          {/* Code */}
          <div className="text-left">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              Código
            </p>
            <p className="mt-1 font-mono text-xs font-bold tracking-wider text-foreground">
              {cert.codigo}
            </p>
            <p className="mt-1 max-w-[200px] truncate font-mono text-[8px] text-muted-foreground">
              {validationUrl.replace(/^https?:\/\//, "")}
            </p>
          </div>

          {/* Signature */}
          <div className="flex flex-col items-center">
            <div className="h-px w-44 bg-foreground" />
            <p className="mt-2 text-sm font-semibold tracking-tight text-foreground">
              Juliana Freitas
            </p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Psicoterapeuta · Projeto Pulsar
            </p>
          </div>

          {/* QR */}
          <div className="flex flex-col items-end gap-1.5">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="QR Code de validação"
                className="size-20 border border-border bg-white p-1"
              />
            ) : (
              <div className="size-20 border border-dashed border-border bg-muted/30" />
            )}
            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted-foreground">
              Escaneie para validar
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Corner brackets (4 cantos decorativos)
// ─────────────────────────────────────────────

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: "left-4 top-4 border-l-2 border-t-2",
    tr: "right-4 top-4 border-r-2 border-t-2",
    bl: "left-4 bottom-4 border-b-2 border-l-2",
    br: "right-4 bottom-4 border-b-2 border-r-2",
  };
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute size-10 border-primary ${map[position]}`}
    />
  );
}
