"use client";
import * as React from "react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "acrylic", label: "Acrylic" },
];

export function ThemeSwitcher({ className = "" }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [isMounted, setIsMounted] = React.useState(false);
	React.useEffect(() => { setIsMounted(true); }, []);

	React.useEffect(() => {
		if (!isMounted) return;
		document.documentElement.classList.remove("light", "dark", "acrylic");
		if (theme === "light" || theme === "dark" || theme === "acrylic") {
			document.documentElement.classList.add(theme);
		}
		localStorage.setItem("theme-mode", theme);
	}, [theme, isMounted]);

					// Ref for each button to measure width/position
					const btnRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
					const [liquid, setLiquid] = React.useState<{ left: number; width: number; height: number } | null>(null);
					const [maskWidth, setMaskWidth] = React.useState<number | null>(null);
					const [maskPhase, setMaskPhase] = React.useState<'wipe' | 'appear'>('appear');
					const [ringKey, setRingKey] = React.useState(0);

					React.useEffect(() => {
						const idx = themes.findIndex(t => t.value === theme);
						const btn = btnRefs.current[idx];
						if (btn) {
							const rect = btn.getBoundingClientRect();
							const parentRect = btn.parentElement?.getBoundingClientRect();
							if (parentRect) {
								setLiquid({
									left: rect.left - parentRect.left,
									width: rect.width,
									height: rect.height
								});
								setRingKey(prev => prev + 1);
								// Start wipe animation
								setMaskPhase('wipe');
								setMaskWidth(2);
								let start: number | null = null;
								const duration = 350;
								function animateWipe(ts: number) {
									if (!start) start = ts;
									const progress = Math.min((ts - start) / duration, 1);
									if (liquid) setMaskWidth(2 + (liquid.width - 2) * progress);
									if (progress < 1) {
										requestAnimationFrame(animateWipe);
									} else {
										// Start appear animation after wipe
										setTimeout(() => {
											setMaskPhase('appear');
											setMaskWidth(liquid ? liquid.width : null);
											start = null;
											function animateAppear(ts2: number) {
												if (!start) start = ts2;
												const progress2 = Math.min((ts2 - start) / duration, 1);
												if (liquid) setMaskWidth(liquid.width - (liquid.width - 2) * progress2);
												if (progress2 < 1) {
													requestAnimationFrame(animateAppear);
												}
											}
											requestAnimationFrame(animateAppear);
										}, 50);
									}
								}
								requestAnimationFrame(animateWipe);
							}
						}
					}, [theme, isMounted]);
											return (
												<div className={className + " relative flex items-center justify-center"}>
													{/* Theme buttons */}
													<div className="flex gap-6">
														{themes.map((t, idx) => (
															<motion.div
																key={t.value}
																animate={{ scale: theme === t.value ? 1.12 : 1, boxShadow: theme === t.value ? "0 4px 24px var(--theme-switcher-shadow, rgba(59,130,246,0.15))" : "none" }}
																transition={{ type: "spring", stiffness: 400, damping: 30 }}
																className="z-10"
															>
																<Button
																	ref={el => { btnRefs.current[idx] = el as HTMLButtonElement | null; }}
																	variant={theme === t.value ? (t.value as any) : "outline"}
																	size="lg"
																	aria-label={t.label + " theme"}
																	onClick={() => setTheme(t.value as any)}
																	className={`theme-btn theme-btn-${t.value} transition-all duration-300 font-semibold px-6 py-3 rounded-xl border-2 ${theme === t.value ? "ring-4 ring-[var(--theme-switcher-ring)]" : "hover:ring-2 hover:ring-[var(--theme-switcher-ring)]"}`}
																>
																	<ThemeIcon theme={t.value as any} />
																	<span className="ml-2 capitalize text-base" style={{ color: `var(--theme-switcher-text, #222)` }}>{t.label}</span>
																</Button>
															</motion.div>
														))}
													</div>
												</div>
											);
}
