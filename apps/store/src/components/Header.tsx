"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/CartProvider";
import { SearchBox } from "@/components/SearchBox";

export function Header() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="tracking-[0.35em] text-sm font-bold">
            BABANI
          </Link>
          <div className="hidden md:block">
            <SearchBox />
          </div>
        </div>

        <nav className="flex items-center gap-6 text-[10px] uppercase tracking-[0.22em] text-black/60 font-medium">
          <div className="md:hidden">
            <SearchBox />
          </div>
          <Link className="hover:text-black transition-colors" href="/">
            Shop
          </Link>
          <button type="button" className="hover:text-black transition-colors flex items-center" onClick={() => cart.open()}>
            CART
            {cart.totalQty > 0 ? (
              <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] font-bold text-white leading-none">
                {cart.totalQty}
              </span>
            ) : null}
          </button>
          <Link className="hover:text-black transition-colors" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
