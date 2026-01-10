import { Pencil, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { Link } from "@tanstack/react-router";

const Header = () => {
  const [search, setSearch] = useState("");
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setOpenUserMenu(false));

  return (
    <header className="relative h-16 px-4 lg:px-6 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-end gap-4">
      <div className="md:hidden w-8" />

      <div className="flex items-center gap-2">
        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpenUserMenu((v) => !v)}
            aria-expanded={openUserMenu}
            aria-haspopup="menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </Button>

          <div
            className={cn(
              "absolute right-0 mt-2 w-56 z-50 origin-top-right rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all duration-200",
              openUserMenu
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
            role="menu"
          >
            <div className="p-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Sua conta</p>
              <p className="text-xs text-muted-foreground">
                Gerencie seu perfil
              </p>
            </div>

            <div className="p-2">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Link to="/profile" onClick={() => setOpenUserMenu(false)}>
                  <Pencil className="w-4 h-4" />
                  Editar informações
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
