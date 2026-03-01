export default function DeliveryPolicyPage() {
  return (
    <div className="max-w-3xl">
      <div className="text-xs uppercase tracking-[0.22em] text-black/60">Delivery Policy</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Delivery</h1>
      <div className="mt-6 space-y-6 text-sm leading-7 text-black/70">
        <section>
          <h2 className="text-lg font-medium text-black mb-2">Delivery Times & Rates</h2>
          <p>
            Delivery times and pricing are dependent on your state and local area within Nigeria.
            Once your order is confirmed, our logistics team will calculate the exact shipping fee
            and timeframe based on your specific location.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-black mb-2">How Checkout Works</h2>
          <p>
            We process all orders directly through our official Customer Support to ensure the best service.
            When you are ready to complete your purchase, follow these steps:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Review the items in your cart.</li>
            <li>Click the <strong>Checkout</strong> button.</li>
            <li>You will be seamlessly redirected to our <strong>Official WhatsApp Business account</strong>.</li>
            <li>All your cart items, quantities, and totals will be automatically sent to us in a message.</li>
            <li>Our representative will reply with the final total including your specific delivery cost and provide payment instructions.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
