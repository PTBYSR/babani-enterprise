import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase, ProductModel } from "@babani/db";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");
  return uri;
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await connectToDatabase(getMongoUri());
  const { id } = await ctx.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const product = await ProductModel.findById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ product });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  await connectToDatabase(getMongoUri());
  const { id } = await ctx.params;
  const body = await req.json();

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const updated = await ProductModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ product: updated });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  await connectToDatabase(getMongoUri());
  const { id } = await ctx.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const deleted = await ProductModel.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
