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
                    <a
                        href="/CERTIFICATE - BABANI ENTERPRISE (2).pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative w-full overflow-hidden rounded-xl border border-black/5 hover:opacity-90 transition-opacity"
                    >
                        {/* We use an image here for better browser compatibility. */}
                        {/* Make sure to save a screenshot of your PDF as CERTIFICATE.png in the apps/store/public folder. */}
                        <Image
                            src="/CERTIFICATE.png"
                            alt="Babani Enterprise Official Certificate"
                            width={800}
                            height={1131}
                            className="w-full h-auto object-cover"
                        />
                    </a>
                    <p className="mt-4 text-center text-xs text-black/50">Click the image to view the full PDF document.</p>
                </div>
            </div>
        </div>
    );
}
