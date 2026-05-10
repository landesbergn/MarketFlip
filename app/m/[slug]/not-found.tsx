import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="eyebrow text-[var(--ink-faint)]">Errata</p>
      <h1 className="headline mt-3 text-5xl sm:text-6xl">
        <span className="italic text-[var(--oxblood)]">No such</span>
        <br />
        market.
      </h1>
      <hr className="rule mx-auto mt-6 w-24" />
      <p className="mt-6 text-[var(--ink-soft)] italic">
        That slug doesn&rsquo;t match any active Polymarket market or event.
      </p>
      <Link href="/" className="ink-link inline-block mt-6">
        ← Back to today&rsquo;s card
      </Link>
    </main>
  );
}
