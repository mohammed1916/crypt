"use client";
import * as React from "react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";

const themes = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "acrylic", label: "Acrylic" },
];

export function ThemeSwitcher({ className = "" }: { className?: string }) {
	const [theme, setTheme] = React.useState<string>(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("theme") || "light";
		}
		return "light";
	});

	React.useEffect(() => {
		if (typeof window !== "undefined") {
			document.documentElement.classList.remove("light", "dark", "acrylic");
			if (theme === "light" || theme === "dark" || theme === "acrylic") {
				document.documentElement.classList.add(theme);
			}
			localStorage.setItem("theme", theme);
		}
	}, [theme]);

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{themes.map((t) => (
				<button
					key={t.value}
					className={`rounded-full p-2 border border-border bg-card hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary ${
						theme === t.value ? "ring-2 ring-primary" : ""
					}`}
					aria-label={t.label + " theme"}
					onClick={() => setTheme(t.value)}
				>
					<ThemeIcon theme={t.value as any} />
				</button>
			))}
		</div>
	);
}
