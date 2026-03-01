import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export function PreFooter() {
    return (
        <div className="border-t border-black/10 bg-black/[0.02]">
            <div className="mx-auto max-w-6xl px-6 py-16 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Have more questions?</h2>
                <p className="mt-3 mx-auto max-w-md text-sm leading-6 text-black/60">
                    Our team is always happy to help you find the perfect scent or answer any questions about your order.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="https://www.instagram.com/shopbabani/?hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-black/20 hover:bg-black/[0.02]"
                    >
                        <Instagram size={20} strokeWidth={1.5} className="text-[#E4405F]" />
                        Instagram
                    </a>
                    <a
                        href="https://wa.me/2349018210296"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-black/20 hover:bg-black/[0.02]"
                    >
                        <MessageCircle size={20} strokeWidth={1.5} className="text-[#25D366]" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
