import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, Award } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Cert = {
  codigo: string;
  nome_aluno_snapshot: string;
  nome_empresa_snapshot: string;
  local_snapshot: string;
  duracao_snapshot: string;
  data_evento_snapshot: string | null;
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

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const metadata = {
  title: "Validação de Certificado | Projeto Pulsar",
};

export default async function ValidarCertificadoPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;

  const admin = createAdminClient();
  const { data } = await admin
    .from("certificados_emitidos")
    .select(
      "codigo, nome_aluno_snapshot, nome_empresa_snapshot, local_snapshot, duracao_snapshot, data_evento_snapshot, emitido_em",
    )
    .eq("codigo", codigo)
    .maybeSingle();

  const cert = data as Cert | null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-secondary/40 to-background">
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/img/logo.png"
              alt="Projeto Pulsar"
              width={36}
              height={36}
              className="rounded-md"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-light tracking-wider text-muted-foreground">
                Projeto
              </span>
              <span className="font-serif text-lg font-bold">Pulsar</span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Ir ao site
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {cert ? (
            <Card className="border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <CardHeader className="items-center text-center">
                <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="size-8" />
                </div>
                <CardTitle className="font-serif text-2xl">
                  Certificado válido
                </CardTitle>
                <CardDescription className="mt-1">
                  Este certificado foi emitido pelo Projeto Pulsar.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Participante
                  </span>
                  <span className="font-serif text-xl font-bold">
                    {cert.nome_aluno_snapshot}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Treinamento
                    </span>
                    <span className="font-medium">
                      {cert.nome_empresa_snapshot}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Local
                    </span>
                    <span className="font-medium">{cert.local_snapshot}</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Duração
                    </span>
                    <span className="font-medium">{cert.duracao_snapshot}</span>
                  </div>
                  {cert.data_evento_snapshot && (
                    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Data
                      </span>
                      <span className="font-medium">
                        {formatDateLong(cert.data_evento_snapshot)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <span>Código de validação</span>
                    <Badge
                      variant="secondary"
                      className="font-mono w-fit"
                    >
                      {cert.codigo}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span>Emitido em</span>
                    <p className="font-medium text-foreground">
                      {formatDateTime(cert.emitido_em)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-destructive/30">
              <CardHeader className="items-center text-center">
                <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <XCircle className="size-8" />
                </div>
                <CardTitle className="font-serif text-2xl">
                  Certificado não encontrado
                </CardTitle>
                <CardDescription className="mt-1">
                  O código <span className="font-mono">{codigo}</span> não
                  corresponde a nenhum certificado emitido.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                Confira se o código está correto, sem espaços extras.
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Award className="size-3.5" />
            Validação oficial — Projeto Pulsar
          </div>
        </div>
      </main>
    </div>
  );
}
