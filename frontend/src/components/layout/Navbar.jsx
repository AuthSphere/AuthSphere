import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

/* ─── tiny helper ─── */
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

/* ════════════════════════════════════════════════════════════════ */
const Navbar = () => {
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

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* notification polling */
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, [user, fetchNotifications]);

  const initials = user?.username?.[0]?.toUpperCase() ?? "?";

  /* ── render ── */
  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,.06)]"
          : "bg-background/40 backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto w-[92%] max-w-7xl h-16 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative h-8 w-8 rounded-lg border border-border/70 bg-background flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-border">
            <img
              src="/assets/logo.png"
              alt="AuthSphere"
              className="h-5 w-5 object-contain dark:invert"
            />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-foreground">
            AuthSphere
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(({ name, href }) => {
            const active = location.pathname === href;
            return (
              <Link
                key={name}
                to={href}
                className={[
                  "relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors duration-150",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                ].join(" ")}
              >
                {name}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary/80 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right cluster ── */}
        <div className="flex items-center gap-0.5">
          {/* GitHub */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://github.com/madhav9757/AuthSphere"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>

          {/* Notifications */}
          {user && (
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
              navigate={navigate}
            />
          )}

          {/* Theme toggle */}
          <AnimatedThemeToggler />

          {/* ── Auth state ── */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse ml-1" />
          ) : user ? (
            <UserMenu
              user={user}
              initials={initials}
              logout={logout}
              loggingOut={loggingOut}
              navigate={navigate}
            />
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="h-8 text-sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="h-8 text-sm px-4 rounded-full">
                  Get started
                </Button>
              </Link>
            </div>
          )}

          {/* ── Mobile hamburger ── */}
          <div className="md:hidden ml-0.5">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Open menu"
                >
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-72 pt-0 px-0 border-l border-border/60 bg-background"
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

/* ════════════════════════════════════════════════════════════════
   Notification dropdown
   ════════════════════════════════════════════════════════════════ */
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
        className="relative h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        )}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-80 p-0 overflow-hidden rounded-xl border border-border/60 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-4.5 min-w-4.5 px-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-border/30">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => {
                if (!n.read) markAsRead(n._id);
              }}
              className={[
                "w-full text-left flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
                !n.read ? "bg-primary/3" : "",
              ].join(" ")}
            >
              {/* unread dot */}
              <div className="mt-1.5 shrink-0">
                {n.read ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-transparent" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug truncate ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}
                >
                  {n.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-muted-foreground/70 mt-1.5 block">
                  {formatTimeAgo(n.createdAt)}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center gap-2 text-center px-4">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              You're all caught up
            </p>
            <p className="text-xs text-muted-foreground/60">
              No new notifications
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-muted/20">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View all activity
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ════════════════════════════════════════════════════════════════
   User menu dropdown
   ════════════════════════════════════════════════════════════════ */
const UserMenu = ({ user, initials, logout, loggingOut, navigate }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="h-8 gap-1.5 rounded-full pl-1 pr-2 ml-1 hover:bg-muted/60 transition-colors"
      >
        <Avatar user={user} initials={initials} size={28} />
        <span className="hidden sm:block text-sm font-medium max-w-25 truncate">
          {user.username}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      sideOffset={8}
      className="w-56 rounded-xl border-border/60 shadow-xl p-1"
    >
      {/* Identity */}
      <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
        <Avatar user={user} initials={initials} size={32} />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{user.username}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <DropdownMenuSeparator className="my-1" />

      {[
        { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
        { label: "Settings", icon: Settings, to: "/settings" },
        { label: "Security", icon: Shield, to: "/settings/sessions" },
        { label: "Audit Logs", icon: Activity, to: "/audit-logs" },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <DropdownMenuItem
            key={item.label}
            onClick={() => navigate(item.to)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer"
          >
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        );
      })}

      <DropdownMenuSeparator className="my-1" />

      <DropdownMenuItem
        onClick={logout}
        disabled={loggingOut}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/8"
      >
        <LogOut className="h-3.5 w-3.5" />
        {loggingOut ? "Logging out…" : "Log out"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

/* ════════════════════════════════════════════════════════════════
   Mobile slide-over menu
   ════════════════════════════════════════════════════════════════ */
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <span className="text-sm font-semibold">Menu</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md -mr-1"
          onClick={close}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 px-3 py-3">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => go(item.href)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left w-full transition-colors",
                active
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="h-px bg-border/50 mx-4" />

      {/* Auth section */}
      <div className="px-3 py-3 mt-auto">
        {user ? (
          <>
            {/* User identity */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/40 mb-3">
              <Avatar user={user} initials={initials} size={34} />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.username}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-0.5">
              {[
                { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
                { label: "Settings", icon: Settings, to: "/settings" },
                { label: "Security", icon: Shield, to: "/settings/sessions" },
                { label: "Audit Logs", icon: Activity, to: "/audit-logs" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => go(item.to)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full text-left"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}

              <div className="h-px bg-border/50 my-1" />

              <button
                onClick={() => {
                  logout();
                  close();
                }}
                disabled={loggingOut}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/6 transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2 px-1 pb-2">
            <Button
              variant="outline"
              className="w-full h-9 rounded-full text-sm"
              onClick={() => go("/login")}
            >
              Log in
            </Button>
            <Button
              className="w-full h-9 rounded-full text-sm"
              onClick={() => go("/register")}
            >
              Get started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   Shared avatar
   ════════════════════════════════════════════════════════════════ */
const Avatar = ({ user, initials, size = 28 }) => (
  <div
    style={{ height: size, width: size, minWidth: size }}
    className="rounded-full bg-muted border border-border/60 flex items-center justify-center overflow-hidden ring-offset-background"
  >
    {user?.picture ? (
      <img
        src={user.picture}
        alt={user.username ?? "avatar"}
        className="h-full w-full object-cover"
      />
    ) : (
      <span
        className="font-semibold text-muted-foreground"
        style={{ fontSize: size * 0.38 }}
      >
        {initials}
      </span>
    )}
  </div>
);

export default Navbar;
