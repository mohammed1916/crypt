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
									const [ringAnim, setRingAnim] = React.useState<'vanish' | 'appear'>('appear');
									const [ringKey, setRingKey] = React.useState(0);
								// Ripple effect removed

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
															setRingAnim('vanish');
															setRingKey(prev => prev + 1);
															setTimeout(() => setRingAnim('appear'), 250);
														}
													}
												}, [theme, isMounted]);

						return (
							<div className={`relative flex items-center gap-2 ${className}`}> {/* no inline style */}
								<div className="flex items-center gap-4 relative w-fit">
																					{/* Modern ring animation: vanish from center, appear from sides */}
																									<AnimatePresence mode="wait">
																										{liquid && (
																											<motion.div
																												key={ringKey}
																												layoutId="theme-ring"
																												className="absolute z-0 pointer-events-none"
																												style={{
																													top: 0,
																													left: liquid.left,
																													width: liquid.width,
																													height: liquid.height,
																													borderRadius: 12,
																													border: '3px solid #3b82f6',
																													boxShadow: '0 0 16px 4px rgba(59,130,246,0.15)',
																													background: 'rgba(59,130,246,0.08)',
																													transformOrigin: 'center',
																												}}
																												initial={{ opacity: 1, scaleX: 1 }}
																												animate={ringAnim === 'vanish' ? { opacity: 1, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
																												exit={{ opacity: 0, scaleX: 1 }}
																												transition={{ duration: 0.25, ease: 'easeInOut' }}
																											/>
																										)}
																									</AnimatePresence>
									{themes.map((t, idx) => (
										<motion.div
											key={t.value}
											animate={{ scale: theme === t.value ? 1.08 : 1 }}
											transition={{ type: "spring", stiffness: 400, damping: 30 }}
											className="z-10"
										>
																	<Button
																		ref={el => { btnRefs.current[idx] = el as HTMLButtonElement | null; }}
																		variant={theme === t.value ? (t.value as any) : "outline"}
																		size="sm"
																		aria-label={t.label + " theme"}
																		onClick={() => setTheme(t.value as any)}
																		className={theme === t.value ? "" : ""}
																	>
																		<ThemeIcon theme={t.value as any} />
																	</Button>
										</motion.div>
									))}
								</div>
							</div>
						);
}
