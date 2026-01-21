import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Zap,
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/useMobile";
import { Button } from "../ui/button";
import { useAuthActions } from "../../hooks/useAuth";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const menu = [
  { id: "dashboard", label: "Dashboard", to: "/", icon: Home },
  { id: "bills", label: "Boletos", to: "/bills", icon: FileText },
  {
    id: "insights",
    label: "Análise de gastos",
    to: "/insights",
    icon: BarChart3,
  },
  {
    id: "notifications",
    label: "Notificações",
    to: "/notifications",
    icon: Bell,
  },
  {
    id: "settings",
    label: "Configurações",
    to: "/configurations",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuthActions();

  const isMobile = useIsMobile();

  const sidebarRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sidebarRef, () => {
    if (open && isMobile) {
      setOpen(false);
    }
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-card"
      >
        {open ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
        ref={sidebarRef}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">
              FinFlow
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              activeOptions={item.to === "/" ? { exact: true } : undefined}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              activeProps={{
                className: "text-primary bg-sidebar-accent",
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-destructive/80"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="w-5 h-5" />
            {logout.isPending ? "Saindo..." : "Sair"}
          </Button>
        </div>
      </aside>
    </>
  );
};
