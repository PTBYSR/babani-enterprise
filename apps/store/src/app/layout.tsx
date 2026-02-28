import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { Toast } from "@/components/cart/Toast";

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
          <div className="min-h-dvh">
            <Header />
            <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
            <Footer />
            <MiniCartDrawer />
            <Toast />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
