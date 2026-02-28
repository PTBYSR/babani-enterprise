import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const form = await req.formData();
    const password = String(form.get("password") ?? "");

    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
        return NextResponse.json({ error: "Missing ADMIN_PASSWORD" }, { status: 500 });
    }

    if (password !== expected) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const res = NextResponse.redirect(new URL("/products", req.url));
    res.cookies.set("admin_auth", "1", {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    });
    return res;
}
