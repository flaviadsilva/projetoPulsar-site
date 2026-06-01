import { Suspense } from "react";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Entrar | Projeto Pulsar",
};

export default function LoginPage() {
  return (
    <AuthShell
      sideEyebrow="Bem-vindo de volta"
      sideTitle={
        <>
          Continue sua
          <br />
          jornada com o
          <br />
          Projeto Pulsar.
        </>
      }
      sideSubtitle="Acesse seu painel para acompanhar seu treinamento, emitir certificados e ver as próximas vivências."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
