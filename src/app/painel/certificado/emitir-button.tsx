"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emitirCertificado } from "./actions";

export function EmitirButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleEmit() {
    startTransition(async () => {
      const result = await emitirCertificado();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Certificado emitido!");
      router.replace(`/painel/certificado?codigo=${result.codigo}`);
      router.refresh();
    });
  }

  return (
    <Button onClick={handleEmit} disabled={disabled || isPending} size="lg">
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Award className="size-4" />
      )}
      Emitir novo certificado
    </Button>
  );
}
