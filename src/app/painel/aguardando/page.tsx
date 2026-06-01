import { redirect } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AguardandoPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.status === "approved") redirect("/painel");

  const rejected = profile.status === "rejected";

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Card className="border-primary/20">
        <CardHeader className="items-center text-center">
          <div
            className={
              "mb-3 flex size-16 items-center justify-center rounded-full " +
              (rejected
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary")
            }
          >
            {rejected ? (
              <XCircle className="size-8" />
            ) : (
              <Clock className="size-8" />
            )}
          </div>
          <CardTitle className="font-serif text-2xl">
            {rejected ? "Cadastro não aprovado" : "Aguardando aprovação"}
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {rejected
              ? "Sua solicitação de cadastro foi recusada pelo administrador."
              : "Sua conta foi criada com sucesso e está aguardando aprovação do administrador."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          {!rejected && (
            <>
              <p>
                Você receberá acesso completo ao painel assim que sua conta for
                aprovada. Esse processo costuma ser rápido.
              </p>
              <p>
                Em caso de dúvidas, entre em contato pelo WhatsApp{" "}
                <a
                  href="https://wa.me/5551985140070"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  (51) 98514-0070
                </a>
                .
              </p>
            </>
          )}
          {rejected && (
            <p>
              Se acredita que houve um engano, entre em contato com a equipe
              pelo WhatsApp{" "}
              <a
                href="https://wa.me/5551985140070"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                (51) 98514-0070
              </a>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
