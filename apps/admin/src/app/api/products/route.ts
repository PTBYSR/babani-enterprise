import { NextResponse } from "next/server";
import { connectToDatabase, ProductModel } from "@babani/db";

function getMongoUri() {
  return process.env.MONGODB_URI;
}

export async function GET() {
  const uri = getMongoUri();
  if (!uri) return NextResponse.json({ products: [] });
  await connectToDatabase(uri);
  const products = await ProductModel.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const uri = getMongoUri();
  if (!uri) return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
  await connectToDatabase(uri);
  const body = await req.json();

  const created = await ProductModel.create(body);
  return NextResponse.json({ product: created }, { status: 201 });
}
