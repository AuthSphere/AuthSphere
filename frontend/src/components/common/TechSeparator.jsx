import React from "react";

/**
 * High-precision architectural separator icon replacing raw `//` ASCII characters
 * across headers, badges, and section indices.
 */
export const TechSeparator = ({ variant = "diamond", className = "" }) => {
  if (variant === "chevron") {
    // Dual angled micro-chevrons (developer pipeline / CLI aesthetic)
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center mx-2 text-neutral-400 dark:text-neutral-500 select-none align-middle ${className}`}
      >
        <svg
          className="w-3 h-3 stroke-current"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 3L7.5 7L3.5 11M7.5 3L11.5 7L7.5 11"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  if (variant === "reticle") {
    // Blueprint coordinate reticle / crosshair
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center mx-2 text-neutral-400 dark:text-neutral-500 select-none align-middle ${className}`}
      >
        <svg
          className="w-3 h-3 stroke-current"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="6" cy="6" r="4.5" strokeWidth="0.8" strokeOpacity="0.4" />
          <path
            d="M6 1.5V10.5M1.5 6H10.5"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (variant === "slash") {
    // Stylized vector dual-slash with terminal nodes
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center mx-2 text-neutral-400 dark:text-neutral-500 select-none align-middle ${className}`}
      >
        <svg
          className="w-3 h-3 stroke-current"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4"
            y1="12"
            x2="8"
            y2="2"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="8"
            y1="12"
            x2="12"
            y2="2"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="2" r="1" fill="currentColor" />
        </svg>
      </span>
    );
  }

  // Default: Cryptographic Node / Architectural Diamond
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center mx-2 text-neutral-400 dark:text-neutral-500 select-none align-middle ${className}`}
    >
      <svg
        className="w-2.5 h-2.5"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="5"
          y="1.2"
          width="5.2"
          height="5.2"
          transform="rotate(45 5 1.2)"
          className="stroke-current fill-current fill-opacity-15 dark:fill-opacity-20"
          strokeWidth="1"
        />
        <circle cx="5" cy="5" r="1" fill="currentColor" />
      </svg>
    </span>
  );
};

export default TechSeparator;
