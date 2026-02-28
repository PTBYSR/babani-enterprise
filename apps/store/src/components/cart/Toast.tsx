"use client";

import { useCart } from "@/components/cart/CartProvider";

export function Toast() {
  const cart = useCart();

  if (!cart.toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm">
      {cart.toast}
    </div>
  );
}
