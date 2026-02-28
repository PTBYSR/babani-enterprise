import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/20"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-black/[0.03]">
        {(() => {
          const imgUrl = product.images?.[0]?.url ?? product.image?.url ?? "";
          const valid = imgUrl.startsWith("/") || (() => { try { new URL(imgUrl); return true; } catch { return false; } })();
          if (!valid) return null;
          return (
            <Image
              src={imgUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          );
        })()}
      </div>
      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-black/60">
          {product.brand}
        </div>
        <div className="mt-1 text-sm font-medium tracking-wide">{product.name}</div>
        <div className="mt-2 flex items-center justify-between text-xs text-black/60">
          <span>
            {product.sizeMl}ml · {product.concentration}
          </span>
          <span className="text-black">{formatMoney(product.price, product.currency)}</span>
        </div>
      </div>
    </Link>
  );
}
