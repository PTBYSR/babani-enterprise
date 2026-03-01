import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.22em] text-black/60">About Us</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Babani Enterprise</h1>

            <div className="mt-6 space-y-4 text-sm leading-7 text-black/70">
                <p>
                    Welcome to Babani Enterprise, where we believe in the quiet luxury of fine fragrances.
                    Our mission is to provide you with premium, long-lasting perfumes that leave a memorable impression.
                </p>
                <p>
                    We carefully curate and craft scents designed with precision and character, ensuring that
                    every bottle delivers an exceptional olfactory experience. Thank you for choosing Babani.
                </p>
            </div>

            <div className="mt-12">
                <h2 className="text-lg font-medium tracking-tight border-b border-black/10 pb-2 mb-6">Our Official Certification</h2>
                <div className="rounded-2xl border border-black/10 p-4 bg-black/[0.02]">
                    <object
                        data="/CERTIFICATE - BABANI ENTERPRISE (2).pdf"
                        type="application/pdf"
                        className="w-full h-[600px] rounded-xl"
                    >
                        <p>Your browser does not support PDFs. <a href="/CERTIFICATE - BABANI ENTERPRISE (2).pdf" className="underline hover:text-black">Download the certificate</a>.</p>
                    </object>
                </div>
            </div>
        </div>
    );
}
