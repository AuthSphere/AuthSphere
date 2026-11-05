import React from "react";
import logoMain from "@/assets/AuthSphere(main).png";
import logoMono from "@/assets/AuthSphere.png";

/**
 * AuthSphereLogo
 * Renders the authentic AuthSphere brand emblem from project assets.
 *
 * @param {string} className - Tailwind CSS classes for sizing and layout (default: "w-6 h-6")
 * @param {"main" | "mono"} variant - "main" (rich electric cyan & deep navy) or "mono" (crisp black silhouette)
 * @param {string} alt - Alt text for accessibility
 */
export const AuthSphereLogo = ({
  className = "w-6 h-6",
  variant = "main",
  alt = "AuthSphere Logo",
  ...props
}) => {
  const src = variant === "mono" ? logoMono : logoMain;

  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain select-none shrink-0 ${className}`}
      loading="eager"
      decoding="async"
      {...props}
    />
  );
};

export default AuthSphereLogo;
