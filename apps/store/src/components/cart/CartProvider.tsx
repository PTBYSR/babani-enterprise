"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export type SelectedVariant = {
  optionName: string;
  value: string;
  price: number;
};

export type CartLine = {
  product: Product;
  qty: number;
  selectedVariant?: SelectedVariant;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, qty?: number, selectedVariant?: SelectedVariant) => void;
  remove: (lineKey: string) => void;
  setQty: (lineKey: string, qty: number) => void;
  clear: () => void;
  totalQty: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function getLineKey(line: CartLine): string {
  if (line.selectedVariant) {
    return `${line.product._id}::${line.selectedVariant.optionName}::${line.selectedVariant.value}`;
  }
  return line.product._id;
}

function storageKey() {
  return "babani_cart_v1";
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey());
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartLine[];
      if (Array.isArray(parsed)) setLines(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(lines));
    } catch {
      // ignore
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (product, qty = 1, selectedVariant) => {
      const lineKey = selectedVariant
        ? `${product._id}::${selectedVariant.optionName}::${selectedVariant.value}`
        : product._id;
      setLines((prev) => {
        const existing = prev.find((l) => getLineKey(l) === lineKey);
        if (!existing) return [...prev, { product, qty, selectedVariant }];
        return prev.map((l) => (getLineKey(l) === lineKey ? { ...l, qty: l.qty + qty } : l));
      });
      setIsOpen(true);
      const variantLabel = selectedVariant ? ` (${selectedVariant.value})` : "";
      setToast(`Added ${product.name}${variantLabel} to cart`);
    };

    const remove: CartContextValue["remove"] = (lineKey) => {
      setLines((prev) => prev.filter((l) => getLineKey(l) !== lineKey));
    };

    const setQty: CartContextValue["setQty"] = (lineKey, qty) => {
      setLines((prev) =>
        prev
          .map((l) => (getLineKey(l) === lineKey ? { ...l, qty } : l))
          .filter((l) => l.qty > 0)
      );
    };

    const clear: CartContextValue["clear"] = () => setLines([]);

    const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const showToast = (message: string) => {
      setToast(message);
    };

    return { lines, add, remove, setQty, clear, totalQty, isOpen, open, close, toast, showToast };
  }, [lines, isOpen, toast]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
