import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel } from "@babani/db";

function getMongoUri() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) throw new Error("Missing MONGODB_URI (or MONGO_URI)");
  return uri;
}

export async function GET() {
  await connectToDatabase(getMongoUri());
  const products = await ProductModel.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  await connectToDatabase(getMongoUri());
  const body = await req.json();

  const created = await ProductModel.create(body);
  return NextResponse.json({ product: created }, { status: 201 });
}
