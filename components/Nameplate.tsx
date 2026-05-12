import Link from "next/link";
import { HeaderCoin } from "./HeaderCoin";
import { AboutButton } from "./AboutButton";

type Props = {
  /** Show a "back" link on the right (used on non-home pages). */
  showBack?: boolean;
  /** Override the back link's href. Defaults to "/". */
  backHref?: string;
  /** Override the back link's label. Defaults to "← Today". */
  backLabel?: string;
};

export function Nameplate({
  showBack = false,
  backHref = "/",
  backLabel = "← Today",
}: Props) {
  // The label arrives prefixed with "← ", e.g. "← The field". Mobile shows
  // just the arrow with a 44px tap zone; desktop keeps the full text.
  const trimmedLabel = backLabel.replace(/^←\s*/, "");

  return (
    <header className="mf-nameplate sticky top-0 z-30">
      <div className="mf-nameplate__inner mx-auto max-w-[1024px] px-5 sm:px-8 lg:px-14 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {showBack && (
            <Link
              href={backHref}
              className="mf-back inline-flex items-center justify-center text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
            >
              <span aria-hidden className="mf-back__arrow">←</span>
              <span className="mf-back__label">{` ${trimmedLabel}`}</span>
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-2 sm:gap-3 text-[19px] sm:text-[26px] min-w-0"
            style={{
              lineHeight: 1,
              letterSpacing: "-0.022em",
              color: "var(--ink)",
              fontWeight: 600,
            }}
          >
            <span className="flex-none mf-headercoin">
              <HeaderCoin />
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                display: "inline-block",
                lineHeight: 1,
                // Italic glyphs (the 'p' in "Flip") have a right-side slant
                // that extends past the inline box; padding-right absorbs it
                // so nothing visually clips the wordmark.
                paddingRight: "0.06em",
              }}
            >
              Market<span style={{ fontStyle: "italic", color: "var(--accent)" }}>Flip</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 flex-none">
          <AboutButton />
        </div>
      </div>
    </header>
  );
}
