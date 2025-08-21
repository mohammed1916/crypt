import * as React from "react";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  theme?: "light" | "dark" | "acrylic";
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, className = "", theme, ...props }, ref) => {
    // Use theme from context or prop if available
    const ovalBg =
      theme === "acrylic"
        ? "bg-[var(--theme-switcher-bg)]"
        : theme === "dark"
        ? "bg-gray-700"
        : "bg-gray-200";
    const circleBg =
      theme === "acrylic"
        ? "bg-[var(--theme-switcher-ring)]"
        : theme === "dark"
        ? "bg-white"
        : "bg-white";

    return (
      <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={e => onCheckedChange(e.target.checked)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={`w-10 h-6 ${ovalBg} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-[var(--theme-switcher-bg)] transition-all duration-200`}
        ></div>
        <div
          className={`absolute left-1 top-1 w-4 h-4 ${circleBg} rounded-full shadow peer-checked:translate-x-4 transition-transform duration-200`}
        ></div>
      </label>
    );
  }
);
Switch.displayName = "Switch";
