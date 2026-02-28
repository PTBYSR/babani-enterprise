export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-xs uppercase tracking-[0.22em] text-black/60">Admin</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>

      <form method="post" action="/api/login" className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm">
          <span className="text-black/70">Password</span>
          <input
            name="password"
            type="password"
            className="h-11 rounded-2xl border border-black/15 px-4"
            required
          />
        </label>

        <button
          type="submit"
          className="inline-flex justify-center rounded-full bg-black px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white hover:bg-black/90"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
