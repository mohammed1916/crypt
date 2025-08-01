import * as React from "react";

export function ThemeIcon({ theme }: { theme: "light" | "dark" | "system" }) {
  if (theme === "light") {
    return (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400"><circle cx="12" cy="12" r="5" strokeWidth="2"/><path strokeWidth="2" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>
    );
  }
  if (theme === "dark") {
    return (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-900 dark:text-yellow-300"><path strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
    );
  }
  // system
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500"><path strokeWidth="2" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.95l-.71-.71M21 12h-1M4 12H3m16.95-7.07l-.71.71M6.34 6.34l-.71-.71"/><circle cx="12" cy="12" r="5" strokeWidth="2"/></svg>
  );
}
