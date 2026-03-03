import { Bell, Pencil, User, Check } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Link } from "@tanstack/react-router";
import {
  useNotificationsCount,
  useNotificationsList,
  useNotificationsActions,
} from "../../../hooks/useNotifications";
import { useAuth } from "../../../hooks/useAuth";
import { formatDateOnlyBR } from "../../../utils/date.utils";

const Header = () => {
  const {
    pushNotifications,
    isLoading: isFetchingList,
    refetchNotifications,
  } = useNotificationsList();
  const { notificationsCount } = useNotificationsCount();
  const { markNotificationRead } = useNotificationsActions();
  const { user } = useAuth();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [clickedNotificationId, setClickedNotificationId] = useState<
    string | null
  >(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setOpenUserMenu(false));
  useOnClickOutside(notifRef, () => setOpenNotifications(false));

  const unreadNotifications = pushNotifications?.filter((n) => !n.isRead) || [];

  const handleNotificationClick = async (notificationId: string) => {
    setClickedNotificationId(notificationId);
    setTimeout(async () => {
      await markNotificationRead.mutateAsync(notificationId);
      setClickedNotificationId(null);
      setOpenNotifications(false);
    }, 300);
  };

  useEffect(() => {
    refetchNotifications();
  }, [notificationsCount, refetchNotifications]);

  return (
    <header className="relative px-4 lg:px-6 border-b border-border bg-card/50 flex items-center justify-end gap-4 h-[89px]">
      <div className="md:hidden w-8" />
      <div className="flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpenNotifications((v) => !v)}
            aria-expanded={openNotifications}
            aria-haspopup="menu"
            aria-label="Notificações"
            data-testid="notifications-button"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {notificationsCount && notificationsCount.unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-destructive text-white text-[11px] leading-4.5 text-center">
                {notificationsCount.unread > 99
                  ? "99+"
                  : notificationsCount.unread}
              </span>
            )}
          </Button>
          <div
            className={cn(
              "absolute right-0 mt-2 w-80 z-50 origin-top-right rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all duration-200",
              openNotifications
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none",
            )}
            role="menu"
          >
            <div className="p-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">
                Notificações
              </p>
              <p className="text-xs text-muted-foreground">
                {notificationsCount && notificationsCount.unread > 0
                  ? `${notificationsCount.unread} não lida${notificationsCount.unread === 1 ? "" : "s"}`
                  : "Nenhuma notificação não lida"}
              </p>
              {notificationsCount && notificationsCount.unread > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Clique para marcar como lida
                </p>
              )}
              {user && user.notificationsEnabled === false && (
                <Button
                  asChild
                  variant="default"
                  className="mt-2 w-full"
                  onClick={() => setOpenNotifications(false)}
                >
                  <Link to="/notifications">Configurar notificações</Link>
                </Button>
              )}
            </div>
            <div className="max-h-96 overflow-auto">
              {isFetchingList &&
              (!pushNotifications || pushNotifications.length === 0) ? (
                <div className="p-3 text-sm text-muted-foreground">
                  Carregando...
                </div>
              ) : !pushNotifications || pushNotifications.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">
                  Você ainda não tem notificações.
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {unreadNotifications.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      Nenhuma notificação não lida.
                    </div>
                  ) : (
                    unreadNotifications.map((n) => (
                      <Button
                        key={n.id}
                        type="button"
                        className={cn(
                          "w-full bg-secondary/20 text-left rounded-xl border border-border p-3 hover:bg-secondary/30 transition-all duration-200 h-full flex flex-col items-start relative overflow-hidden",
                          clickedNotificationId === n.id && "border-green-200",
                        )}
                        onClick={() => handleNotificationClick(n.id)}
                        disabled={clickedNotificationId === n.id}
                        data-testid={`notification-${n.id}`}
                      >
                        {clickedNotificationId === n.id && (
                          <>
                            <div className="absolute inset-0 animate-pulse" />
                            <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
                              <Check className="w-3 h-3" />
                            </div>
                          </>
                        )}
                        <div className="absolute top-3 right-3 flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground italic">
                            não lida
                          </span>
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        </div>
                        <div
                          className={cn(
                            "transition-opacity duration-200",
                            clickedNotificationId === n.id && "opacity-90",
                          )}
                        >
                          <p className="text-sm font-medium text-foreground pr-8">
                            {n.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 pr-8">
                            {n.body}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[11px] text-muted-foreground">
                              {formatDateOnlyBR(new Date(n.createdAt))}
                            </p>
                            {clickedNotificationId === n.id && (
                              <span className="text-[11px] text-green-600 font-medium animate-pulse">
                                Marcando...
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={menuRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setOpenUserMenu((v) => !v)}
            aria-expanded={openUserMenu}
            aria-haspopup="menu"
            data-testid="user-menu-button"
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
                : "opacity-0 -translate-y-2 pointer-events-none",
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
