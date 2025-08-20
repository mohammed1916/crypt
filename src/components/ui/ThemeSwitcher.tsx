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
								const [liquid, setLiquid] = React.useState<{ left: number; width: number; height: number; prevLeft?: number; prevWidth?: number } | null>(null);
								const [ripple, setRipple] = React.useState<{ x: number; y: number; radius: number } | null>(null);
								const prevTheme = React.useRef(theme);

								React.useEffect(() => {
									const idx = themes.findIndex(t => t.value === theme);
									const prevIdx = themes.findIndex(t => t.value === prevTheme.current);
									const btn = btnRefs.current[idx];
									const prevBtn = btnRefs.current[prevIdx];
									if (btn && prevBtn) {
										const rect = btn.getBoundingClientRect();
										const parentRect = btn.parentElement?.getBoundingClientRect();
										const prevRect = prevBtn.getBoundingClientRect();
										if (parentRect) {
											setLiquid({
												left: rect.left - parentRect.left,
												width: rect.width,
												height: rect.height,
												prevLeft: prevRect.left - parentRect.left,
												prevWidth: prevRect.width
											});
											// Ripple effect: center of button
											setRipple({
												x: (rect.left - parentRect.left) + rect.width / 2,
												y: rect.height / 2,
												radius: 0
											});
											setTimeout(() => {
												setRipple(r => r ? { ...r, radius: rect.width * 0.7 } : null);
											}, 10);
											setTimeout(() => {
												setRipple(null);
											}, 400);
										}
									}
									prevTheme.current = theme;
								}, [theme, isMounted]);

						return (
							<div className={`relative flex items-center gap-2 ${className}`}> {/* no inline style */}
								<div className="flex items-center gap-4 relative w-fit">
													{/* Liquid morphing SVG border animation with merging ring-primary and ring-shadow */}
													{liquid && (
														<motion.svg
															className="absolute top-0 left-0 z-0 pointer-events-none"
															width={Math.max(liquid.width, liquid.prevWidth || 0)}
															height={liquid.height}
															style={{
																x: Math.min(liquid.left, liquid.prevLeft || 0),
																y: 0,
																overflow: 'visible',
															}}
														>
															<defs>
																<filter id="liquid-blur" x="-20%" y="-20%" width="140%" height="140%">
																	<feGaussianBlur stdDeviation="4" result="blur" />
																	<feMerge>
																		<feMergeNode in="blur" />
																		<feMergeNode in="SourceGraphic" />
																	</feMerge>
																</filter>
															</defs>
															{/* Previous ring-primary and shadow morphs into destination */}
															{liquid.prevLeft !== undefined && liquid.prevWidth !== undefined && (
																<motion.rect
																	x={liquid.prevLeft - Math.min(liquid.left, liquid.prevLeft)}
																	y={2}
																	width={liquid.prevWidth}
																	height={liquid.height - 4}
																	rx={12}
																	fill="rgba(59,130,246,0.08)"
																	stroke="#3b82f6"
																	strokeWidth={3}
																	filter="url(#liquid-blur)"
																	initial={{
																		x: liquid.prevLeft - Math.min(liquid.left, liquid.prevLeft),
																		width: liquid.prevWidth,
																		opacity: 1,
																		scale: 1
																	}}
																	animate={{
																		x: liquid.left - Math.min(liquid.left, liquid.prevLeft),
																		width: liquid.width,
																		opacity: 1,
																		scale: 1.05
																	}}
																	exit={{ opacity: 0 }}
																	transition={{ type: "spring", stiffness: 300, damping: 30 }}
																/>
															)}
															{/* Ripple effect */}
															{ripple && (
																<motion.circle
																	cx={ripple.x - Math.min(liquid.left, liquid.prevLeft || 0)}
																	cy={ripple.y}
																	r={ripple.radius}
																	fill="rgba(59,130,246,0.15)"
																	initial={{ r: 0, opacity: 0.7 }}
																	animate={{ r: ripple.radius, opacity: 0 }}
																	transition={{ duration: 0.4, ease: "easeOut" }}
																/>
															)}
														</motion.svg>
													)}
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
												className={theme === t.value ? "ring-2 ring-primary" : ""}
											>
												<ThemeIcon theme={t.value as any} />
											</Button>
										</motion.div>
									))}
								</div>
							</div>
						);
}
