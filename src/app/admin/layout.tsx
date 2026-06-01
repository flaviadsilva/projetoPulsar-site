import { redirect } from "next/navigation";
import { LayoutDashboard, UserCheck, Building2, MessageSquare } from "lucide-react";
import { getProfile } from "@/lib/auth/get-profile";
import { AppShell, type AppShellNavItem } from "@/components/app/app-shell";

const navItems: AppShellNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    href: "/admin/cadastros",
    label: "Cadastros",
    icon: <UserCheck className="size-4" />,
  },
  {
    href: "/admin/empresas",
    label: "Empresas",
    icon: <Building2 className="size-4" />,
  },
  {
    href: "/admin/feedbacks",
    label: "Feedbacks",
    icon: <MessageSquare className="size-4" />,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/painel");

  return (
    <AppShell
      user={{ nome: profile.nome, email: profile.email, role: profile.role }}
      navItems={navItems}
    >
      {children}
    </AppShell>
  );
}
