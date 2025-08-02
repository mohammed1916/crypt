import "./globals.css";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import NavbarHeading from "@/components/ui/NavbarHeading";
import Footer from "@/components/ui/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Acrylic animated background */}
        <div
          className="acrylic-bg-gradient fixed inset-0 -z-100 pointer-events-none select-none"
          aria-hidden="true"
        />
        <header className="w-full flex justify-between items-center p-4 border-b border-border bg-background">
          {/* Heading slot: will be replaced by Coin page if provided */}
          <NavbarHeading />
          <ThemeSwitcher />
        </header>
        <div className="backdrop-blur-2xl min-h-[80vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
