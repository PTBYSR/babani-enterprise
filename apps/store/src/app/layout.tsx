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
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babani — Luxury Fragrance Store",
  description: "Experience the art of scent with Babani. Minimal, premium fragrances for those who appreciate the finer things.",
  metadataBase: new URL("https://babani-store.vercel.app"), // Placeholder, update if you have a custom domain
  openGraph: {
    title: "Babani — Luxury Fragrance Store",
    description: "Experience the art of scent with Babani. Minimal, premium fragrances.",
    url: "https://babani-store.vercel.app",
    siteName: "Babani",
    images: [
      {
        url: "/BABANI.png",
        width: 1200,
        height: 630,
        alt: "Babani Logo",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Babani — Luxury Fragrance Store",
    description: "Minimal, premium fragrances.",
    images: ["/BABANI.png"],
  },
  icons: {
    icon: "/next.svg", // Using existing next.svg as placeholder icon, recommend replacing with BABANI.png later
  },
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
            <Analytics />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
