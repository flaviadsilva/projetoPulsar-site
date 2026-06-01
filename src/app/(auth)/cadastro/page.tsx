import { AuthShell } from "../auth-shell";
import { SignupForm } from "./signup-form";

export const metadata = {
  title: "Criar conta | Projeto Pulsar",
};

export default function SignupPage() {
  return (
    <AuthShell
      sideEyebrow="Comece agora"
      sideTitle={
        <>
          Sua jornada
          <br />
          começa no
          <br />
          Projeto Pulsar.
        </>
      }
      sideSubtitle="Crie sua conta para participar dos treinamentos, acompanhar seu progresso e emitir certificados no painel."
    >
      <SignupForm />
    </AuthShell>
  );
}
