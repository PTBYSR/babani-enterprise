import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function FloatingWhatsAppWidget() {
    // Use the same WhatsApp number found on the Contact page
    const phoneNumber = "2349018210296";
    const whatsappUrl = `https://wa.me/${phoneNumber}`;

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:shadow-xl sm:bottom-8 sm:right-8"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle size={32} strokeWidth={1.5} />
        </Link>
    );
}
