import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel } from "@babani/db";

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI (or MONGO_URI)");
  return uri;
}

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  await connectToDatabase(getMongoUri());
  const { slug } = await ctx.params;

  const product = await ProductModel.findOne({ slug, isActive: true });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ product });
}
