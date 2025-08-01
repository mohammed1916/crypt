import "./globals.css";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full flex justify-end items-center p-4 border-b border-border bg-background">
          <ThemeSwitcher />
        </header>
        {children}
      </body>
    </html>
  );
}
