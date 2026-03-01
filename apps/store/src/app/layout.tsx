import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PreFooter } from "@/components/PreFooter";
import { CartProvider } from "@/components/cart/CartProvider";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { Toast } from "@/components/cart/Toast";
import { FloatingWhatsAppWidget } from "@/components/FloatingWhatsAppWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babani — Perfume Store",
  description: "Minimal, premium fragrances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <CartProvider>
          <div className="min-h-dvh flex flex-col">
            <Header />
            <div className="mx-auto max-w-6xl w-full px-6 py-10 flex-grow">{children}</div>
            <PreFooter />
            <Footer />
            <MiniCartDrawer />
            <Toast />
            <FloatingWhatsAppWidget />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
