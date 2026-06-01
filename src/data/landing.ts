import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Hospital,
  GraduationCap,
  Building2,
  HeartHandshake,
  Users,
  HeartPulse,
  Brain,
} from "lucide-react";

export const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#publicos", label: "Públicos" },
  { href: "#depoimentos", label: "Na Prática" },
  { href: "#processo", label: "Como Funciona" },
  { href: "#programas", label: "Projeto" },
] as const;

export const WHATSAPP_URL =
  "https://wa.me/5551985140070?text=Ol%C3%A1%2C%20quero%20saber%20como%20o%20Programa%20Pulsar%20pode%20atender%20minha%20institui%C3%A7%C3%A3o";

export const WHATSAPP_SIMPLE = "https://wa.me/5551985140070";

export type InfoBox = { icon: LucideIcon; label: string };
export const aboutInfoBoxes: InfoBox[] = [
  { icon: Users, label: "+ Treinamentos" },
  { icon: HeartPulse, label: "Saúde Emocional" },
  { icon: Brain, label: "Gestão de Conflitos" },
];

export type AudienceCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const audiences: AudienceCard[] = [
  {
    icon: Landmark,
    title: "Prefeituras",
    description:
      "Fortalecimento da saúde emocional dos servidores e qualificação das relações no serviço público. Práticas que contribuem para ambientes mais colaborativos e funcionais.",
  },
  {
    icon: Hospital,
    title: "Hospitais e Clínicas",
    description:
      "Cuidado emocional de quem cuida. Ações voltadas ao manejo do estresse, fortalecimento dos vínculos e melhoria da comunicação entre equipes de saúde.",
  },
  {
    icon: GraduationCap,
    title: "Escolas",
    description:
      "Apoio emocional a educadores, gestores e equipes pedagógicas. Vivências que favorecem relações mais saudáveis, escuta qualificada e manejo das demandas do cotidiano escolar.",
  },
  {
    icon: Building2,
    title: "Empresas Privadas",
    description:
      "Fortalecimento das relações de trabalho, redução de ruídos e desenvolvimento da comunicação emocional. O Pulsar contribui para equipes mais conscientes, ambientes mais saudáveis e resultados mais sustentáveis.",
  },
  {
    icon: HeartHandshake,
    title: "Instituições Sociais",
    description:
      "Fortalecimento de vínculos e sustentação emocional de equipes que atuam em contextos de alta entrega humana. Práticas que ampliam presença, escuta e cooperação em projetos sociais e organizações do terceiro setor.",
  },
];

export type ProcessStep = { number: string; title: string; description: string };

export const processSteps: ProcessStep[] = [
  {
    number: "1",
    title: "Diagnóstico",
    description:
      "Mapeamento do contexto emocional e relacional da equipe por meio de questionário anônimo e escuta com lideranças.",
  },
  {
    number: "2",
    title: "Construção",
    description:
      "Desenvolvimento de vivências, palestras ou encontros alinhados aos desafios reais identificados no diagnóstico.",
  },
  {
    number: "3",
    title: "Implementação",
    description:
      "Aplicação de práticas que fortalecem comunicação, vínculos, consciência emocional e integração entre as pessoas.",
  },
];

export type Testimonial =
  | {
      type: "text";
      title: string;
      body: string;
    }
  | {
      type: "video";
      src: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
    };

export const testimonials: Testimonial[] = [
  {
    type: "text",
    title: "Oncologia Centenário",
    body:
      "Projeto-piloto desenvolvido com a equipe da oncologia, com foco em descompressão emocional de profissionais que atuam em contexto de alta exigência humana. A proposta favorece alívio de tensões, fortalecimento dos vínculos e qualificação das relações no ambiente de trabalho.",
  },
  { type: "video", src: "/video/JU.mp4" },
  { type: "image", src: "/img/oncologia.jpeg", alt: "Juliana na oncologia" },
  {
    type: "text",
    title: "Equipe de Passo Fundo",
    body:
      "Vivência aplicada com foco na comunicação interpessoal, integração da equipe e fortalecimento das relações de trabalho no cotidiano organizacional.",
  },
  { type: "video", src: "/video/sitio.mp4" },
  { type: "image", src: "/img/sitio.jpeg", alt: "Vivência em Passo Fundo" },
];

export const pulsarBullets = [
  "Melhoria na comunicação interpessoal",
  "Aumento da produtividade e engajamento",
  "Desenvolvimento de liderança consciente",
  "Redução de conflitos e estresse",
];

export const socialLinks = [
  {
    href: "https://www.instagram.com/jufreitas.essencia/",
    label: "Instagram",
    icon: "instagram" as const,
  },
  {
    href: "https://www.facebook.com/juh.jf",
    label: "Facebook",
    icon: "facebook" as const,
  },
  {
    href: "https://www.tiktok.com/@jufreitas.essencia",
    label: "TikTok",
    icon: "tiktok" as const,
  },
];
