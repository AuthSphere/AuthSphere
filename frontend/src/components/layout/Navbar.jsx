import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import AuthSphereLogo from "@/components/common/AuthSphereLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  Shield,
  ChevronDown,
  Github,
  Activity,
  Bell,
  CreditCard,
  FileText,
  X,
  CheckCheck,
  ArrowRight,
} from "lucide-react";

/* ─── Helpers ─── */
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const navLinks = [
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Documentation", href: "/docs", icon: FileText },
];

export const Navbar = () => {
  const { user, loading, logout, loggingOut } = useAuthStore();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, [user, fetchNotifications]);

  const initials = user?.username?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-colors duration-200 backdrop-blur-md",
        scrolled
          ? "bg-background/95 border-b border-border shadow-xs"
          : "bg-background/90 border-b border-border",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="AuthSphere Home"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
              <AuthSphereLogo className="w-7 h-7 object-contain" />
            </div>
            <span className="font-bold text-[17px] tracking-[-0.03em] text-foreground">
              AuthSphere
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ name, href }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={name}
                to={href}
                className={[
                  "relative px-3.5 py-2 text-[13.5px] font-medium transition-colors rounded-md",
                  active
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                ].join(" ")}
              >
                {name}
                {active && (
                  <span className="absolute inset-x-3 -bottom-2 h-[1.5px] rounded-full bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/AuthSphere"
            target="_blank"
            rel="noreferrer"
            aria-label="AuthSphere GitHub Repository"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-mono font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-md hover:bg-accent transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
            <span className="text-[10px] text-muted-foreground/70">↗</span>
          </a>

          <div className="hidden sm:block h-4 w-px bg-border" />
          <AnimatedThemeToggler />

          {user && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              navigate={navigate}
            />
          )}

          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse ml-1" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-foreground bg-muted hover:bg-accent rounded-md transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <UserMenu
                user={user}
                initials={initials}
                logout={logout}
                loggingOut={loggingOut}
                navigate={navigate}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-[13.5px] font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium px-3.5 sm:px-4 h-9 rounded-md transition-colors shadow-xs tracking-tight"
              >
                <span>Get started</span>
                <span className="text-[11px] font-mono">↗</span>
              </Link>
            </div>
          )}

          <div className="md:hidden ml-0.5">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-md text-foreground hover:bg-accent border border-border"
                  aria-label="Open menu"
                >
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-72 pt-0 px-0 border-l border-border bg-background"
              >
                <MobileMenu
                  navLinks={navLinks}
                  location={location}
                  user={user}
                  initials={initials}
                  navigate={navigate}
                  logout={logout}
                  loggingOut={loggingOut}
                  close={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const NotificationDropdown = ({
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  navigate,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 dark:bg-neutral-100 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
          </span>
        )}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-80 p-0 overflow-hidden rounded-lg border border-border bg-popover shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-4.5 min-w-4.5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-border">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => {
                if (!n.read) markAsRead(n._id);
              }}
              className={[
                "w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
                !n.read ? "bg-muted/30" : "",
              ].join(" ")}
            >
              <div className="mt-1.5 shrink-0">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    !n.read ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs leading-snug truncate ${
                    !n.read
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground/80"
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground/80 mt-1.5 block">
                  {formatTimeAgo(n.createdAt)}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="py-10 flex flex-col items-center gap-2 text-center px-4">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-foreground">
              You're all caught up
            </p>
            <p className="text-[11px] text-muted-foreground">
              No new notifications
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-muted/30">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View all activity
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

const UserMenu = ({ user, initials, logout, loggingOut, navigate }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-8 gap-2 rounded-md pl-1 pr-2 hover:bg-accent transition-colors"
      >
        <Avatar user={user} initials={initials} size={26} />
        <span className="hidden sm:block text-xs font-mono font-medium max-w-28 truncate text-foreground">
          {user.username}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-56 rounded-lg border border-border bg-popover shadow-xl p-1"
    >
      {/* Identity */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1 bg-muted/60 rounded-md">
        <Avatar user={user} initials={initials} size={30} />
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate text-foreground">
            {user.username}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>

      <DropdownMenuSeparator className="my-1 bg-border" />

      {[
        { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
        { label: "Settings", icon: Settings, to: "/settings" },
        {
          label: "Security & Sessions",
          icon: Shield,
          to: "/settings/sessions",
        },
        { label: "Audit Logs", icon: Activity, to: "/audit-logs" },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <DropdownMenuItem
            key={item.label}
            onClick={() => navigate(item.to)}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium cursor-pointer text-foreground/80 hover:text-foreground hover:bg-accent"
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        );
      })}

      <DropdownMenuSeparator className="my-1 bg-border" />

      <DropdownMenuItem
        onClick={async () => {
          await logout();
          navigate("/login");
        }}
        disabled={loggingOut}
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-3.5 w-3.5" />
        {loggingOut ? "Signing out…" : "Log out"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileMenu = ({
  navLinks,
  location,
  user,
  initials,
  navigate,
  logout,
  loggingOut,
  close,
}) => {
  const go = (href) => {
    navigate(href);
    close();
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <AuthSphereLogo className="w-5 h-5 object-contain" />
          <span className="font-bold text-sm tracking-tight text-foreground">
            AuthSphere
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-muted-foreground"
          onClick={close}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => go(item.href)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium text-left w-full transition-colors",
                active
                  ? "bg-accent text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{item.name}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}

        <a
          href="https://github.com/AuthSphere"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Github className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span>GitHub</span>
          <span className="ml-auto text-[11px] font-mono text-muted-foreground">
            ↗
          </span>
        </a>
      </nav>

      <div className="h-px bg-border mx-4" />

      <div className="px-4 py-4 mt-auto">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/60 mb-3">
              <Avatar user={user} initials={initials} size={32} />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate text-foreground">
                  {user.username}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              {[
                { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
                { label: "Settings", icon: Settings, to: "/settings" },
                {
                  label: "Security & Sessions",
                  icon: Shield,
                  to: "/settings/sessions",
                },
                { label: "Audit Logs", icon: Activity, to: "/audit-logs" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => go(item.to)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full text-left"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="h-px bg-border my-1.5" />

              <button
                onClick={async () => {
                  await logout();
                  close();
                  navigate("/login");
                }}
                disabled={loggingOut}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                <span>{loggingOut ? "Signing out…" : "Log out"}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              className="w-full h-9 rounded-md text-xs font-medium border-border"
              onClick={() => go("/login")}
            >
              Sign in
            </Button>
            <Button
              className="w-full h-9 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => go("/register")}
            >
              Get started ↗
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Avatar = ({ user, initials, size = 28 }) => (
  <div
    style={{ height: size, width: size, minWidth: size }}
    className="rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0"
  >
    {user?.picture ? (
      <img
        src={user.picture}
        alt={user.username ?? "avatar"}
        className="h-full w-full object-cover"
      />
    ) : (
      <span
        className="font-mono font-semibold text-foreground"
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </span>
    )}
  </div>
);

export default Navbar;
