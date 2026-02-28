export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl">
      <div className="text-xs uppercase tracking-[0.22em] text-black/60">Delivery / Shipping Policy</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Shipping</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-black/70">
        <p>
          This store is currently a demo checkout without payments. When you enable payments, add your shipping
          zones, carriers, delivery windows, and returns process here.
        </p>
        <p>Typical sections: processing time, rates, tracking, damaged parcels, and returns.</p>
      </div>
    </div>
  );
}
