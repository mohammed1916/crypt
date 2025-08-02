import "./globals.css";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import NavbarHeading from "@/components/ui/NavbarHeading";
import Footer from "@/components/ui/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ToastProvider>
            {/* Acrylic animated background */}
            <div
              className="acrylic-bg-gradient fixed inset-0 -z-100 pointer-events-none select-none"
              aria-hidden="true"
            />
            <header className="acrylic-card-noborderradius w-full flex justify-between items-center p-4 border-b border-border">
              {/* Heading slot: will be replaced by Coin page if provided */}
              <NavbarHeading />
              <ThemeSwitcher />
            </header>
            <div className="backdrop-blur-2xl min-h-[80vh]">{children}</div>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
