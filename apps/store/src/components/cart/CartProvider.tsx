"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

export type CartLine = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  totalQty: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toast: string | null;
  showToast: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

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
    const add: CartContextValue["add"] = (product, qty = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.product._id === product._id);
        if (!existing) return [...prev, { product, qty }];
        return prev.map((l) => (l.product._id === product._id ? { ...l, qty: l.qty + qty } : l));
      });
      setIsOpen(true);
      setToast(`Added ${product.name} to cart`);
    };

    const remove: CartContextValue["remove"] = (productId) => {
      setLines((prev) => prev.filter((l) => l.product._id !== productId));
    };

    const setQty: CartContextValue["setQty"] = (productId, qty) => {
      setLines((prev) =>
        prev
          .map((l) => (l.product._id === productId ? { ...l, qty } : l))
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
