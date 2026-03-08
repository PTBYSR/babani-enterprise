"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCart, getLineKey } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/format";

export default function CartPage() {
  const cart = useCart();

  const subtotal = useMemo(() => {
    return cart.lines.reduce((sum, l) => {
      const price = l.selectedVariant?.price ?? l.product.price;
      return sum + price * l.qty;
    }, 0);
  }, [cart.lines]);

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-black/60">Cart</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your selections</h1>
        </div>
        {cart.lines.length > 0 ? (
          <button
            type="button"
            onClick={() => cart.clear()}
            className="text-xs uppercase tracking-[0.22em] text-black/60 hover:text-black"
          >
            Clear
          </button>
        ) : null}
      </div>

      {cart.lines.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-black/10 p-10">
          <div className="text-sm text-black/70">Your cart is empty.</div>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {cart.lines.map((l) => {
                const lineKey = getLineKey(l);
                const linePrice = l.selectedVariant?.price ?? l.product.price;
                return (
                  <div key={lineKey} className="flex gap-4 rounded-3xl border border-black/10 p-4">
                    <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-black/[0.03]">
                      {(() => {
                        const imgUrl = l.product.images?.[0]?.url ?? l.product.image?.url ?? "";
                        const valid = imgUrl.startsWith("/") || (() => { try { new URL(imgUrl); return true; } catch { return false; } })();
                        if (!valid) return null;
                        return (
                          <Image src={imgUrl} alt={l.product.name} fill className="object-cover" />
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-black/60">{l.product.brand}</div>
                      <div className="mt-1 text-sm font-medium">{l.product.name}</div>
                      {l.selectedVariant && (
                        <div className="mt-1 text-xs text-black/50">
                          {l.selectedVariant.optionName}: {l.selectedVariant.value}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-black/60">
                        {l.product.sizeMl}ml · {l.product.concentration}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="h-9 w-9 rounded-full border border-black/15 text-sm hover:border-black/30"
                            onClick={() => cart.setQty(lineKey, l.qty - 1)}
                          >
                            −
                          </button>
                          <div className="min-w-10 text-center text-sm">{l.qty}</div>
                          <button
                            type="button"
                            className="h-9 w-9 rounded-full border border-black/15 text-sm hover:border-black/30"
                            onClick={() => cart.setQty(lineKey, l.qty + 1)}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="rounded-full border border-black/15 px-3 py-2 text-xs uppercase tracking-[0.22em] text-black/70 hover:border-black/30"
                          onClick={() => cart.remove(lineKey)}
                        >
                          Remove
                        </button>

                        <div className="text-sm font-medium">
                          {formatMoney(linePrice * l.qty, l.product.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky top-6 h-fit rounded-3xl border border-black/10 p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-black/60">Summary</div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-black/70">Subtotal</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-black/70">Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <div className="mt-6 border-t border-black/10 pt-6">
              <button
                type="button"
                onClick={() => {
                  const phoneNumber = "2349018210296"; // You can change this to your actual number
                  let message = `*NEW ORDER*\n\n`;
                  message += `Hi, I would like to place an order for the following items:\n\n`;

                  cart.lines.forEach((l, index) => {
                    const linePrice = l.selectedVariant?.price ?? l.product.price;
                    message += `${index + 1}. *${l.product.name}*\n`;
                    if (l.selectedVariant) {
                      message += `   ${l.selectedVariant.optionName}: ${l.selectedVariant.value}\n`;
                    }
                    message += `   Quantity: ${l.qty}\n`;
                    message += `   Price: ${formatMoney(linePrice * l.qty, l.product.currency)}\n`;
                  });

                  message += `\n*Subtotal: ${formatMoney(subtotal)}*\n\n`;
                  message += `Please confirm my order.`;

                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
                }}
                className="inline-flex w-full justify-center rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
              >
                Checkout to WhatsApp
              </button>
              <Link
                href="/"
                className="mt-3 inline-flex w-full justify-center rounded-full border border-black/15 px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black/80 hover:border-black/30"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
