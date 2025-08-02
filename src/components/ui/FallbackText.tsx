import React from "react";

interface FallbackTextProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export default function FallbackText({ children, fallback = <span className="text-muted-foreground">Try again later</span>, className }: FallbackTextProps) {
  // Accepts null, undefined, empty string as fallback
  const isEmpty = children === null || children === undefined || (typeof children === "string" && children.trim() === "");
  return (
    <span className={className}>{isEmpty ? fallback : children}</span>
  );
}
