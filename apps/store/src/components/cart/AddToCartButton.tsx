"use client";

import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={() => cart.add(product, 1)}
      className="rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
    >
      Add to cart
    </button>
  );
}
