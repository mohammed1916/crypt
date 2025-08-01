"use client";
import * as React from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type?: ToastType;
}

const ToastContext = React.createContext<{
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      {typeof window !== "undefined" && createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-2 rounded shadow text-white text-sm animate-fade-in-up ${toast.type === "error" ? "bg-red-600" : toast.type === "success" ? "bg-green-600" : "bg-gray-800"}`}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.showToast;
}
