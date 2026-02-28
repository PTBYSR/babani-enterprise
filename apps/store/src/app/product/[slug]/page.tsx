import Image from "next/image";
import { notFound } from "next/navigation";
import { connectToDatabase, ProductModel } from "@babani/db";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/types";

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.MONGO_URI;
}

function isValidUrl(url: string) {
  return url.startsWith("/") || (() => { try { new URL(url); return true; } catch { return false; } })();
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const uri = getMongoUri();
  if (!uri) {
    console.warn("MONGODB_URI is missing. Skipping database connection during build.");
    notFound();
  }

  await connectToDatabase(uri);
  const doc = await ProductModel.findOne({ slug, isActive: true });
  if (!doc) notFound();

  const product = JSON.parse(JSON.stringify(doc)) as Product;

  // Resolve image list — prefer images[], fall back to image.url
  const allImages = (product.images && product.images.length > 0)
    ? product.images.map((i) => i.url)
    : (product.image?.url ? [product.image.url] : []);
  const validImages = allImages.filter(isValidUrl);
  const primaryImage = validImages[0] ?? null;

  const intensity = product.intensity ?? 50;
  const intensityLabel = intensity < 30 ? "Moderate" : intensity < 70 ? "Balanced" : "Beast Mode";

  const rating = 4.2 + ((product.slug.length % 6) * 0.1);
  const ratingRounded = Math.round(rating * 10) / 10;
  const ratingsCount = 3500 + (product.slug.length * 173);
  const likes = 65000 + (product.slug.length * 4900);

  const initials = product.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");


  return (
    <div className="mx-auto grid max-w-5xl gap-8">

      {/* Main card: image + details */}
      <div className="grid gap-6 rounded-3xl border border-black/10 bg-white p-6 md:grid-cols-2 md:p-8">

        {/* Image column */}
        <div className="flex flex-col gap-3">
          {/* Primary image */}
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-black/[0.03]">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/30">No image</div>
            )}
          </div>

          {/* Additional images gallery */}
          {validImages.length > 1 && (
            <div className="flex gap-2 justify-center">
              {validImages.slice(1).map((url, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded-2xl bg-black/[0.03]">
                  <Image
                    src={url}
                    alt={`${product.name} ${i + 2}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="flex flex-col gap-5">
          {/* Title, name, likes */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-black/60">{product.brand}</div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
              <div className="text-black/60">♡</div>
              <div className="tabular-nums">{likes.toLocaleString("en-GB")}</div>
            </div>
          </div>

          {/* Rating */}
          <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
            <div className="text-3xl font-semibold tabular-nums">{ratingRounded}</div>
            <div>
              <div className="flex items-center gap-1 text-black">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(ratingRounded) ? "" : "text-black/20"}>★</span>
                ))}
              </div>
              <div className="text-sm text-black/60">({ratingsCount.toLocaleString("en-GB")} ratings)</div>
            </div>
          </div>

          {/* Description + price + cart */}
          <div className="rounded-3xl border border-black/10 p-5">
            <div className="text-sm leading-7 text-black/70">{product.description}</div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-base font-semibold">{formatMoney(product.price, product.currency)}</div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <AddToCartButton product={product} />
              <a
                href="/cart"
                className="rounded-full border border-black/15 px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black/80 hover:border-black/30"
              >
                View cart
              </a>
            </div>
          </div>

          {/* Intensity bar */}
          <div className="rounded-3xl border border-black/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-[0.22em] text-black/60">Intensity</div>
              <div className="text-xs font-medium uppercase tracking-[0.18em]">{intensityLabel}</div>
            </div>
            <div className="h-3 rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className="h-3 rounded-full bg-black transition-all"
                style={{ width: `${Math.min(100, Math.max(0, intensity))}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.18em] text-black/40">
              <span>Moderate</span>
              <span>Beast Mode</span>
            </div>
          </div>

          {/* Periodic-table profile card */}
          <div className="relative overflow-hidden rounded-3xl bg-emerald-700 p-6 text-white">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-4 h-32 w-32 rounded-full bg-white/5" />
            <div className="text-xs uppercase tracking-[0.22em] text-white/70">Fragrance</div>
            <div className="mt-6 text-7xl font-semibold tracking-tight leading-none">{initials || "BX"}</div>
            <div className="mt-3 text-sm text-white/80 truncate">{product.name}</div>
          </div>
        </div>
      </div>


    </div>
  );
}
