import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { fillCertificatePdf } from "@/lib/certificates/pdf-generator";

type Params = { codigo: string };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { codigo } = await params;
  const isDownload = request.nextUrl.searchParams.get("download") === "1";

  // Permitir acesso público (página de validação) mas sem cache
  const admin = createAdminClient();
  const { data: cert } = await admin
    .from("certificados_emitidos")
    .select(
      "codigo, profile_id, nome_aluno_snapshot, nome_empresa_snapshot, local_snapshot, duracao_snapshot, data_evento_snapshot",
    )
    .eq("codigo", codigo)
    .maybeSingle();

  if (!cert) {
    return new NextResponse("Certificado não encontrado", { status: 404 });
  }

  // Se for cliente logado, garantir que é o dono OU admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && user.id !== cert.profile_id) {
      // Bloqueia se logado mas não é dono nem admin
      return new NextResponse("Acesso negado", { status: 403 });
    }
  }
  // Se não logado, deixa passar (rota pública de validação pode usar)

  const origin = request.nextUrl.origin;
  const validationUrl = `${origin}/certificado/${codigo}`;

  const pdfBytes = await fillCertificatePdf({
    codigo: cert.codigo,
    nome_aluno: cert.nome_aluno_snapshot,
    nome_empresa: cert.nome_empresa_snapshot,
    local: cert.local_snapshot,
    duracao: cert.duracao_snapshot,
    data_evento: cert.data_evento_snapshot,
    validation_url: validationUrl,
  });

  const disposition = isDownload
    ? `attachment; filename="certificado-pulsar-${cert.codigo}.pdf"`
    : `inline; filename="certificado-pulsar-${cert.codigo}.pdf"`;

  return new NextResponse(new Uint8Array(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-cache",
    },
  });
}
