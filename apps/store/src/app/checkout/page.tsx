"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/format";

export default function CheckoutPage() {
  const cart = useCart();
  const [submitted, setSubmitted] = useState(false);

  const subtotal = useMemo(() => cart.lines.reduce((sum, l) => sum + l.product.price * l.qty, 0), [cart.lines]);

  if (cart.lines.length === 0 && !submitted) {
    return (
      <div className="rounded-3xl border border-black/10 p-10">
        <div className="text-sm text-black/70">Your cart is empty.</div>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-black/10 p-10">
        <div className="text-xs uppercase tracking-[0.22em] text-black/60">Order placed</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Thank you.</h1>
        <p className="mt-4 text-sm leading-7 text-black/70">
          This is a structured checkout without payment integration. You can connect Stripe/PayPal later.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="text-xs uppercase tracking-[0.22em] text-black/60">Checkout</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Delivery details</h1>

        <form
          className="mt-8 grid gap-4 rounded-3xl border border-black/10 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            cart.clear();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-black/70">First name</span>
              <input className="h-11 rounded-2xl border border-black/15 px-4" required />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-black/70">Last name</span>
              <input className="h-11 rounded-2xl border border-black/15 px-4" required />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            <span className="text-black/70">Email</span>
            <input type="email" className="h-11 rounded-2xl border border-black/15 px-4" required />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-black/70">Address</span>
            <input className="h-11 rounded-2xl border border-black/15 px-4" required />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-black/70">City</span>
              <input className="h-11 rounded-2xl border border-black/15 px-4" required />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-black/70">Postal code</span>
              <input className="h-11 rounded-2xl border border-black/15 px-4" required />
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex justify-center rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
          >
            Place order
          </button>
        </form>
      </div>

      <div className="h-fit rounded-3xl border border-black/10 p-6">
        <div className="text-xs uppercase tracking-[0.22em] text-black/60">Order summary</div>
        <div className="mt-4 grid gap-3">
          {cart.lines.map((l) => (
            <div key={l.product._id} className="flex items-start justify-between gap-3 text-sm">
              <div className="text-black/70">
                {l.product.name} <span className="text-black/40">× {l.qty}</span>
              </div>
              <div className="font-medium">{formatMoney(l.product.price * l.qty, l.product.currency)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-black/10 pt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black/70">Subtotal</span>
            <span className="font-medium">{formatMoney(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-black/70">Shipping</span>
            <span className="font-medium">—</span>
          </div>
        </div>
      </div>
    </div>
  );
}
