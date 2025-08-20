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
							const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; radius: number }>>([]);

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
													// Ripples for all buttons
													const newRipples = btnRefs.current.map((b, i) => {
														if (!b) return null;
														const r = b.getBoundingClientRect();
														return {
															x: (r.left - parentRect.left) + r.width / 2,
															y: r.height / 2,
															radius: 0
														};
													}).filter(Boolean) as Array<{ x: number; y: number; radius: number }>;
													setRipples(newRipples);
													setTimeout(() => {
														setRipples(rs => rs.map((r, i) => {
															const btn = btnRefs.current[i];
															if (!btn) return { ...r, radius: 0 };
															const rect = btn.getBoundingClientRect();
															return { ...r, radius: rect.width * 0.7 };
														}));
													}, 10);
													setTimeout(() => {
														setRipples([]);
													}, 400);
												}
											}
										}, [theme, isMounted]);

						return (
							<div className={`relative flex items-center gap-2 ${className}`}> {/* no inline style */}
								<div className="flex items-center gap-4 relative w-fit">
																	{/* Liquid ring using layoutId for merging effect */}
																	<AnimatePresence>
																		{liquid && (
																			<motion.div
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
																					background: 'rgba(59,130,246,0.08)'
																				}}
																				initial={{ opacity: 0, scale: 0.95 }}
																				animate={{ opacity: 1, scale: 1 }}
																				exit={{ opacity: 0, scale: 0.95 }}
																				transition={{ type: "spring", stiffness: 300, damping: 30 }}
																			/>
																		)}
																	</AnimatePresence>
																	{/* Ripple effect for all buttons */}
																	{liquid && (
																		<svg
																			className="absolute top-0 left-0 z-0 pointer-events-none"
																			width={liquid.width}
																			height={liquid.height}
																			style={{ x: liquid.left, y: 0, overflow: 'visible' }}
																		>
																			{ripples.map((r, i) => (
																				<motion.circle
																					key={i}
																					cx={r.x - liquid.left}
																					cy={r.y}
																					r={r.radius}
																					fill="rgba(59,130,246,0.15)"
																					initial={{ r: 0, opacity: 0.7 }}
																					animate={{ r: r.radius, opacity: 0 }}
																					transition={{ duration: 0.4, ease: "easeOut" }}
																				/>
																			))}
																		</svg>
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
