import Link from "next/link";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { connectToDatabase, ProductModel } from "@babani/db";

export const dynamic = "force-dynamic";

function getMongoUri() {
  return process.env.MONGODB_URI;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}
async function saveUploadedFile(file: File): Promise<string> {
  const { url } = await put(file.name, file, { access: 'public' });
  return url;
}

export default function NewProductPage() {
  async function createProduct(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = Number(formData.get("price") ?? 0);
    const slug = slugify(name);

    const imageFiles = formData.getAll("images") as File[];
    const images: { url: string }[] = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await saveUploadedFile(file);
        images.push({ url });
      }
    }

    const uri = getMongoUri();
    if (!uri) {
      console.error("MONGODB_URI is missing. Cannot create product.");
      return;
    }
    await connectToDatabase(uri);
    await ProductModel.create({ name, slug, description, price, images });

    redirect("/products");
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-black/60">Products</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">New product</h1>
        </div>
        <Link className="text-xs uppercase tracking-[0.22em] text-black/60 hover:text-black" href="/products">
          Back
        </Link>
      </div>

      <form action={createProduct} className="mt-10 grid gap-6 rounded-3xl border border-black/10 p-8">
        {/* Title */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Title</span>
          <input
            name="name"
            className="h-11 rounded-2xl border border-black/15 px-4 focus:border-black/40 focus:outline-none"
            placeholder="e.g. Midnight Rose"
            required
          />
        </label>

        {/* Description */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Description</span>
          <textarea
            name="description"
            className="min-h-32 rounded-2xl border border-black/15 px-4 py-3 focus:border-black/40 focus:outline-none"
            placeholder="Describe the fragrance…"
            required
          />
        </label>

        {/* Price */}
        <label className="grid gap-2 text-sm">
          <span className="font-medium text-black/80">Price (NGN)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            className="h-11 rounded-2xl border border-black/15 px-4 focus:border-black/40 focus:outline-none"
            placeholder="0.00"
            required
          />
        </label>

        {/* Images */}
        <div className="grid gap-3 text-sm">
          <span className="font-medium text-black/80">Images <span className="font-normal text-black/40">(up to 3)</span></span>
          <div className="grid gap-3 rounded-2xl border border-black/10 bg-black/[0.01] p-4">
            {[1, 2, 3].map((n) => (
              <label key={n} className="flex items-center gap-3 cursor-pointer">
                <span className="w-5 text-right text-xs text-black/40">{n}.</span>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  className="flex-1 text-sm text-black/70 file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-1.5 file:text-xs file:font-medium file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-black/80"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex justify-center rounded-full bg-black px-8 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/80 transition-colors"
        >
          Create product
        </button>
      </form>
    </div>
  );
}
