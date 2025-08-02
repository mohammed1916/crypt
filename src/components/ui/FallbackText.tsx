import React from "react";
import { useToast } from "./toast";

interface FallbackTextProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export default function FallbackText({ children, fallback = <span className="text-muted-foreground">Try again later</span>, className }: FallbackTextProps) {
  const showToast = useToast();
  // Accepts null, undefined, empty string as fallback
  const isEmpty = children === null || children === undefined || (typeof children === "string" && children.trim() === "");
  // Detect 500 Internal Server Error
  if (typeof children === "string" && children.includes("500 (Internal Server Error)")) {
    showToast("Connection to Internet Lost", "error");
  }
  return (
    <span className={className}>{isEmpty ? fallback : children}</span>
  );
}
