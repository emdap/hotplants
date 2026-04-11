// Courtesy of Claude

import { useEffect } from "react";

const FIRE_CSS = `
@keyframes fire-flicker {
  0%, 100% {
    text-shadow:
      0 0 4px #fff,
      0 -4px 10px #ff3,
      0 -8px 20px #f90,
      0 -14px 28px #c33,
      0 -20px 36px #900;
  }
  25% {
    text-shadow:
      0 0 4px #fff,
      0 -6px 14px #ff3,
      0 -12px 24px #f90,
      0 -18px 32px #c33,
      0 -24px 40px #900;
  }
  50% {
    text-shadow:
      0 0 6px #fff,
      0 -3px 8px #ff3,
      0 -7px 18px #f90,
      0 -12px 26px #c33,
      0 -18px 34px #900;
  }
  75% {
    text-shadow:
      0 0 3px #fff,
      0 -5px 12px #ff3,
      0 -10px 22px #f90,
      0 -16px 30px #c33,
      0 -22px 38px #900;
  }
}
.fire-flicker {
  animation: fire-flicker 1.5s ease-in-out infinite alternate;
}
`;

export default function FireText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  useEffect(() => {
    if (!document.getElementById("fire-text-styles")) {
      const tag = document.createElement("style");
      tag.id = "fire-text-styles";
      tag.textContent = FIRE_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  return <span className={`fire-flicker ${className}`}>{children}</span>;
}
