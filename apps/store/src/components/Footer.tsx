import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2">
        <div>
          <div className="text-xs font-semibold tracking-[0.35em]">BABANI</div>
          <div className="mt-3 max-w-md text-sm text-black/60">
            Minimal, premium fragrances. Quiet luxury, crafted for everyday ritual.
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.22em] text-black/70 md:justify-self-end">
          <Link className="hover:text-black" href="/privacy-policy">
            Privacy
          </Link>
          <Link className="hover:text-black" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-black" href="/shipping-policy">
            Shipping
          </Link>
          <Link className="hover:text-black" href="/contact">
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-black/10 py-5 text-center text-xs text-black/50">
        © {new Date().getFullYear()} Babani
      </div>
    </footer>
  );
}
