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
												{/* Animated SVG ring mask */}
												{liquid && maskWidth !== null && (
													<svg
														key={ringKey}
														className="absolute z-10 pointer-events-none"
														style={{
															top: 0,
															left: liquid.left,
															width: liquid.width,
															height: liquid.height,
															borderRadius: 12,
															pointerEvents: 'none',
															display: 'block',
														}}
														width={liquid.width}
														height={liquid.height}
													>
														<defs>
															<mask id={`ring-mask-${ringKey}`}> 
																<rect x={0} y={0} width={liquid.width} height={liquid.height} fill="white" />
																{/* Animated mask: wipe/appear */}
																<rect
																	x={maskPhase === 'wipe' ? liquid.width / 2 - maskWidth / 2 : 0}
																	y={0}
																	width={maskWidth}
																	height={liquid.height}
																	fill="black"
																/>
															</mask>
														</defs>
														<rect
															x={0}
															y={0}
															width={liquid.width}
															height={liquid.height}
															rx={12}
															fill="#e0f2ff"
															stroke="#3b82f6"
															strokeWidth={3}
															mask={`url(#ring-mask-${ringKey})`}
														/>
													</svg>
												)}
												{/* Theme buttons */}
												<div className="flex gap-4">
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
