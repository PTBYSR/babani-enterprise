"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/components/cart/CartProvider";
import { SearchBox } from "@/components/SearchBox";

export function Header() {
  const cart = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left: Logo & Desktop Search */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/BABANI.png"
              alt="Babani Logo"
              width={100}
              height={30}
              className="object-contain"
              priority
            />
          </Link>
          <div className="hidden md:block">
            <SearchBox />
          </div>
        </div>

        {/* Right: Desktop Nav & Mobile Toggles */}
        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium">
          {/* Desktop Links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link className="hover:text-black transition-colors" href="/contact">
              Contact
            </Link>
            <Link className="hover:text-black transition-colors" href="/about">
              About Us
            </Link>
          </nav>

          {/* Cart Button (Always visible) */}
          <button type="button" className="hover:text-black transition-colors flex items-center" onClick={() => cart.open()}>
            CART
            {cart.totalQty > 0 ? (
              <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] font-bold text-white leading-none">
                {cart.totalQty}
              </span>
            ) : null}
          </button>

          {/* Mobile Hamburger Toggle (Hidden on desktop) */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/5 bg-white px-6 py-4 shadow-lg absolute w-full left-0 flex flex-col gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-black/70">
          <Link href="/contact" className="py-2 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/about" className="py-2 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </Link>
        </div>
      )}
    </header>
  );
}
