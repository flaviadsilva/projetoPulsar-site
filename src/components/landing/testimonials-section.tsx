import { createClient } from "@/lib/supabase/server";
import { Testimonials } from "./testimonials";
import {
  FeedbacksCarousel,
  type PublicFeedback,
} from "./feedbacks-carousel";

type FeedbackRow = {
  id: string;
  nome_snapshot: string;
  empresa_snapshot: string | null;
  mensagem: string;
  nota: number | null;
};

export async function TestimonialsSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("feedbacks")
    .select("id, nome_snapshot, empresa_snapshot, mensagem, nota")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(20);

  const feedbacks: PublicFeedback[] = ((data ?? []) as FeedbackRow[]).map(
    (f) => ({
      id: f.id,
      nome: f.nome_snapshot,
      empresa: f.empresa_snapshot,
      mensagem: f.mensagem,
      nota: f.nota,
    }),
  );

  return (
    <>
      <Testimonials />
      <FeedbacksCarousel items={feedbacks} />
    </>
  );
}
