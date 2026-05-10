// app/m/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="text-2xl font-bold">Market not found</h1>
      <p className="mt-2 text-zinc-600 text-sm">
        That slug doesn't match any active Polymarket market or event.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm underline">
        ← Back to home
      </Link>
    </main>
  );
}
