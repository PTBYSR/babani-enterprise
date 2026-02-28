import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/products" className="tracking-[0.35em] text-sm font-semibold">
          BABANI ADMIN
        </Link>
        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.22em] text-black/70">
          <Link className="hover:text-black" href="/products">
            Products
          </Link>
          <Link className="hover:text-black" href="/products/new">
            Add
          </Link>
        </nav>
      </div>
    </header>
  );
}
