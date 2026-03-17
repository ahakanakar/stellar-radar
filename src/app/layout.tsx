import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import WalletConnect from "@/components/WalletConnect";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Radar",
  description: "Stellar ekosistemindeki dapp'leri keşfet, on-chain metriklerle doğrula.",
};

const themeScript = `
(function(){
  var t=localStorage.getItem("theme")||"system";
  var d=t==="system"?window.matchMedia("(prefers-color-scheme:dark)").matches:t==="dark";
  if(d)document.documentElement.classList.add("dark");
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity">
                Stellar Radar
              </Link>
              <Link href="/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
