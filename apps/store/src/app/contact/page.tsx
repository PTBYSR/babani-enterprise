import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-3xl">
      <div className="text-xs uppercase tracking-[0.22em] text-black/60">Contact</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Get in touch</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <a
          href="https://www.instagram.com/shopbabani/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center rounded-3xl border border-black/10 bg-white p-8 transition hover:border-black/20 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E4405F]/10 text-[#E4405F] transition group-hover:bg-[#E4405F] group-hover:text-white">
            <Instagram size={24} strokeWidth={1.5} />
          </div>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]">Instagram</div>
          <div className="mt-1 text-[11px] text-black/50 tracking-wide">@shopbabani</div>
        </a>

        <a
          href="https://wa.me/2349018210296"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center rounded-3xl border border-black/10 bg-white p-8 transition hover:border-black/20 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] transition group-hover:bg-[#25D366] group-hover:text-white">
            <MessageCircle size={24} strokeWidth={1.5} />
          </div>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]">WhatsApp</div>
          <div className="mt-1 text-[11px] text-black/50 tracking-wide">09018210296</div>
        </a>

        <a
          href="mailto:babanienterprise@gmail.com"
          className="group flex flex-col items-center rounded-3xl border border-black/10 bg-white p-8 transition hover:border-black/20 hover:shadow-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EA4335]/10 text-[#EA4335] transition group-hover:bg-[#EA4335] group-hover:text-white">
            <Mail size={24} strokeWidth={1.5} />
          </div>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]">Email</div>
          <div className="mt-1 text-[11px] text-black/50 tracking-wide">babanienterprise</div>
        </a>
      </div>
    </div>
  );
}
