import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { roboto } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "PolaPrints",
  description: "Create Polaroids, save memories in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <html lang="en">
      <body className={`${roboto.className}  antialiased`}>
        <Header />
        <main className="min-h-[calc(100svh_-_100px)] flex items-center justify-center bg-slate-500">
          {children}
        </main>
        <Footer />
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
