import React from "react";
import { clsx } from "clsx";

/**
 * Environment wrapper that provides consistent theming and typography
 * without imposing layout constraints.
 */
export const MendeluEnvironment: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      data-theme="mendelu-dark"
      className={clsx("font-inter text-base-content antialiased", className)}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {children}
    </div>
  );
};
