import React from "react";
import logoMain from "@/assets/AuthSphere(main).png";
import logoMono from "@/assets/AuthSphere.png";
import { AuthSphereEmblemIcon } from "@/components/common/SocialIcons";
import useThemeStore from "@/store/themeStore";

export const AuthSphereLogo = ({
  className = "w-6 h-6",
  variant = "auto",
  alt = "AuthSphere Logo",
  style,
  ...props
}) => {
  const { theme } = useThemeStore();

  if (variant === "svg") {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={style}
      >
        <AuthSphereEmblemIcon className="w-full h-full text-current" />
      </span>
    );
  }

  if (variant === "mono") {
    return (
      <img
        src={logoMono}
        alt={alt}
        className={`object-contain select-none shrink-0 dark:brightness-0 dark:invert ${className}`}
        style={{
          filter: theme === "dark" ? "brightness(0) invert(1)" : undefined,
          ...style,
        }}
        loading="eager"
        decoding="async"
        {...props}
      />
    );
  }

  if (variant === "main") {
    return (
      <img
        src={logoMain}
        alt={alt}
        className={`object-contain select-none shrink-0 ${className}`}
        style={style}
        loading="eager"
        decoding="async"
        {...props}
      />
    );
  }

  // Auto mode: uses both Tailwind CSS classes for instant zero-flash render
  // and theme store awareness
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={style}
    >
      {/* Light mode: colorful brand mark */}
      <img
        src={logoMain}
        alt={alt}
        className="w-full h-full object-contain select-none dark:hidden"
        loading="eager"
        decoding="async"
        {...props}
      />
      {/* Dark mode: crisp white monochrome mark */}
      <img
        src={logoMono}
        alt={alt}
        className="w-full h-full object-contain select-none hidden dark:block brightness-0 invert"
        style={{
          filter: "brightness(0) invert(1)",
          ...style,
        }}
        loading="eager"
        decoding="async"
        {...props}
      />
    </span>
  );
};

export default AuthSphereLogo;
