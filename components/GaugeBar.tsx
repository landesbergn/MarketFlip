type Props = {
  yesProb: number;
  yesLabel: string;
  noLabel: string;
  /** When provided, draws a "↑ landed" tick under the side that landed. */
  landed?: "YES" | "NO" | null;
};

/**
 * Horizontal yes/no gauge — the at-a-glance read above the fold on mobile.
 * Two contiguous slabs sized by yes/no probability with a 50% reference tick
 * and contrast-aware in-bar labels.
 */
export function GaugeBar({ yesProb, yesLabel, noLabel, landed }: Props) {
  const yes = Math.round(yesProb * 100);
  const no = 100 - yes;
  const minW = 4;
  const yesW = Math.max(minW, Math.min(100 - minW, yes));

  const yesToken = yesLabel.toUpperCase();
  const noToken = noLabel.toUpperCase();

  return (
    <div>
      <div
        role="img"
        aria-label={`${yes}% ${yesLabel}, ${no}% ${noLabel}`}
        style={{
          position: "relative",
          height: 40,
          width: "100%",
          background: "var(--rule-soft)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${yesW}%`,
            background: "var(--accent)",
            transition: "width 240ms ease",
          }}
        />
        {/* 50% reference tick */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: -3,
            bottom: -3,
            width: 1,
            background: "var(--ink)",
            opacity: 0.45,
          }}
        />
        {/* In-bar labels — contrast-aware */}
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
            fontSize: 19,
            color: yes >= 14 ? "var(--paper)" : "var(--accent)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {yes}
          <span
            className="figure"
            style={{
              fontStyle: "normal",
              fontSize: 9,
              letterSpacing: "0.16em",
              marginLeft: 5,
            }}
          >
            {yesToken}
          </span>
        </span>
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
            fontSize: 19,
            color: no >= 14 ? "var(--ink)" : "var(--paper)",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {no}
          <span
            className="figure"
            style={{
              fontStyle: "normal",
              fontSize: 9,
              letterSpacing: "0.16em",
              marginLeft: 5,
            }}
          >
            {noToken}
          </span>
        </span>
      </div>
      {landed && (
        <div
          style={{
            marginTop: 8,
            height: 14,
            position: "relative",
          }}
        >
          <span
            className="figure"
            style={{
              position: "absolute",
              left:
                landed === "YES"
                  ? `calc(${yesW / 2}% - 32px)`
                  : `calc(${yesW + (100 - yesW) / 2}% - 32px)`,
              width: 64,
              textAlign: "center",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-mono)",
              lineHeight: 1,
            }}
          >
            ↑ landed
          </span>
        </div>
      )}
    </div>
  );
}
