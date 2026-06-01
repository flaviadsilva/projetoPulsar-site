import { redirect } from "next/navigation";
import { Home, Award, MessageSquare } from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import { AppShell, type AppShellNavItem } from "@/components/app/app-shell";

const navItems: AppShellNavItem[] = [
  {
    href: "/painel",
    label: "Início",
    icon: <Home className="size-4" />,
  },
  {
    href: "/painel/certificado",
    label: "Certificado",
    icon: <Award className="size-4" />,
  },
  {
    href: "/painel/feedback",
    label: "Feedback",
    icon: <MessageSquare className="size-4" />,
  },
];

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  return (
    <AppShell
      user={{ nome: profile.nome, email: profile.email, role: profile.role }}
      navItems={profile.status === "approved" ? navItems : []}
    >
      {children}
    </AppShell>
  );
}
