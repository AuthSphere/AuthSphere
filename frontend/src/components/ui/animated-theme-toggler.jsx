import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useThemeStore from "@/store/themeStore";

/**
 * Minimal, instant theme toggle button.
 * Removed heavy view-transition clip-path animation.
 */
export const AnimatedThemeToggler = ({ className, ...props }) => {
  const { theme, setTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-8 w-8 text-muted-foreground hover:text-foreground transition-colors",
        className,
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
