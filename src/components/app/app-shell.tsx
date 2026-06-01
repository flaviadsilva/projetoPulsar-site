import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export type AppShellNavItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export function AppShell({
  user,
  navItems = [],
  children,
}: {
  user: { nome: string; email: string; role: "admin" | "cliente" };
  navItems?: AppShellNavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/40 bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={user.role === "admin" ? "/admin" : "/painel"} className="flex items-center gap-3">
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

          {navItems.length > 0 && (
            <nav className="hidden gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">{user.nome}</p>
              <p className="text-xs leading-tight text-muted-foreground">
                {user.email}
              </p>
            </div>
            <form action={signOut}>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Sair"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
        {navItems.length > 0 && (
          <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 pb-3 md:hidden sm:px-6 lg:px-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="container mx-auto flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
