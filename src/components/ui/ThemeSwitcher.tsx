"use client";
import * as React from "react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useTheme } from "@/context/ThemeContext";

const themes = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "acrylic", label: "Acrylic" },
];

export function ThemeSwitcher({ className = "" }: { className?: string }) {
	const { theme, setTheme } = useTheme();

	React.useEffect(() => {
		if (typeof window !== "undefined") {
			document.documentElement.classList.remove("light", "dark", "acrylic");
			if (theme === "light" || theme === "dark" || theme === "acrylic") {
				document.documentElement.classList.add(theme);
			}
			localStorage.setItem("theme-mode", theme);
		}
	}, [theme]);

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{themes.map((t) => (
				<button
					key={t.value}
					className={
						[
							"rounded-full p-2 border border-border bg-card hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary",
							theme === t.value ? "ring-2 ring-primary" : "",
						].join(" ")
					}
					aria-label={t.label + " theme"}
					onClick={() => setTheme(t.value as any)}
				>
					<ThemeIcon theme={t.value as any} />
				</button>
			))}
		</div>
	);
}
