export function CityscapeBanner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground glow */}
      <ellipse cx="200" cy="230" rx="260" ry="90" fill="var(--color-primary-soft)" opacity="0.6" />

      {/* Skyline silhouette */}
      <g opacity="0.35" fill="var(--color-primary)">
        <rect x="10" y="90" width="34" height="110" rx="2" />
        <rect x="50" y="60" width="26" height="140" rx="2" />
        <rect x="82" y="105" width="30" height="95" rx="2" />
        <rect x="290" y="75" width="28" height="125" rx="2" />
        <rect x="324" y="100" width="34" height="100" rx="2" />
        <rect x="362" y="55" width="28" height="145" rx="2" />
        {/* little windows */}
        <g fill="var(--color-primary-light)">
          <rect x="17" y="100" width="6" height="6" />
          <rect x="30" y="100" width="6" height="6" />
          <rect x="17" y="116" width="6" height="6" />
          <rect x="30" y="116" width="6" height="6" />
          <rect x="58" y="72" width="6" height="6" />
          <rect x="70" y="72" width="6" height="6" />
          <rect x="58" y="88" width="6" height="6" />
          <rect x="332" y="112" width="6" height="6" />
          <rect x="344" y="112" width="6" height="6" />
          <rect x="370" y="68" width="6" height="6" />
          <rect x="382" y="68" width="6" height="6" />
          <rect x="370" y="84" width="6" height="6" />
        </g>
      </g>

      {/* Bushes */}
      <g fill="var(--color-success-light)">
        <ellipse cx="60" cy="205" rx="40" ry="16" />
        <ellipse cx="340" cy="205" rx="46" ry="18" />
      </g>

      {/* Signpost pole */}
      <rect x="196" y="120" width="8" height="90" rx="2" fill="#a9794f" />

      {/* ADVENTURE sign (pointing right) */}
      <g>
        <path d="M150 122 H252 L266 137 L252 152 H150 Z" fill="var(--color-primary)" />
        <text x="195" y="142" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="1">
          ADVENTURE
        </text>
      </g>

      {/* AWAITS sign (pointing left) */}
      <g>
        <path d="M250 158 H148 L134 173 L148 188 H250 Z" fill="var(--color-ink)" opacity="0.85" />
        <text x="205" y="178" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="2">
          AWAITS
        </text>
      </g>
    </svg>
  );
}
