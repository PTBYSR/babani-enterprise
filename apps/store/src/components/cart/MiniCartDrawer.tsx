"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/format";

export function MiniCartDrawer() {
  const cart = useCart();

  const subtotal = useMemo(
    () => cart.lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [cart.lines]
  );

  if (!cart.isOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close cart"
        className="fixed inset-0 z-40 bg-black/30"
        onClick={() => cart.close()}
      />
      <aside className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md border-l border-black/10 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-black/60">Cart</div>
          <button
            type="button"
            className="rounded-full border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.22em] text-black/70 hover:border-black/30"
            onClick={() => cart.close()}
          >
            Close
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="mt-8 text-sm text-black/70">Your cart is empty.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {cart.lines.map((l) => (
              <div key={l.product._id} className="flex gap-3 rounded-3xl border border-black/10 p-3">
                <div className="relative h-16 w-14 overflow-hidden rounded-2xl bg-black/[0.03]">
                  <Image src={l.product.image.url} alt={l.product.image.alt} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{l.product.name}</div>
                  <div className="mt-1 text-xs text-black/60">
                    qty {l.qty} · {formatMoney(l.product.price * l.qty, l.product.currency)}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-black/15 text-sm hover:border-black/30"
                      onClick={() => cart.setQty(l.product._id, l.qty - 1)}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-black/15 text-sm hover:border-black/30"
                      onClick={() => cart.setQty(l.product._id, l.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ml-auto rounded-full border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.22em] text-black/70 hover:border-black/30"
                      onClick={() => cart.remove(l.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-2 rounded-3xl border border-black/10 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black/70">Subtotal</span>
                <span className="font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <div className="mt-4 grid gap-2">
                <Link
                  href="/checkout"
                  onClick={() => cart.close()}
                  className="inline-flex w-full justify-center rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={() => cart.close()}
                  className="inline-flex w-full justify-center rounded-full border border-black/15 px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black/80 hover:border-black/30"
                >
                  View cart
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
