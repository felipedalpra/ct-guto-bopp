/**
 * Motivos gráficos do Beach Tennis.
 *
 * Todos são decorativos (aria-hidden) e herdam `currentColor`, para servirem tanto
 * na superfície escura quanto na clara.
 *
 * A escolha dos desenhos não é aleatória: são as duas coisas que distinguem o
 * Beach Tennis de qualquer outro esporte de raquete à primeira vista — a raquete
 * SEM cordas (sólida, perfurada) e a bolinha despressurizada de duas cores. Um
 * desenho de raquete com cordas leria como tênis, e é exatamente o erro que a
 * maior parte do material de Beach Tennis comete.
 */

type Props = { className?: string };

/** Raquete de Beach Tennis: pá sólida com furos, cabo curto. */
export function Raquete({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 120 200" fill="none" aria-hidden="true">
      {/* Pá — mais larga na ponta que na base, como as raquetes de verdade. */}
      <path
        d="M60 6C29 6 8 34 8 74c0 33 19 58 52 58s52-25 52-58C112 34 91 6 60 6Z"
        stroke="currentColor"
        strokeWidth="4"
      />
      {/* Furos: a assinatura visual da raquete sólida. */}
      <g fill="currentColor" opacity="0.45">
        {[
          [42, 46],
          [60, 40],
          [78, 46],
          [34, 66],
          [52, 60],
          [68, 60],
          [86, 66],
          [42, 84],
          [60, 78],
          [78, 84],
          [52, 100],
          [68, 100],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
        ))}
      </g>
      {/* Cabo e punho. */}
      <path d="M60 132v34" stroke="currentColor" strokeWidth="4" />
      <rect
        x="49"
        y="164"
        width="22"
        height="30"
        rx="7"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
}

/**
 * Bolinha de Beach Tennis. Duas cores porque a bola despressurizada usada no
 * esporte é assim — é o detalhe que faz o desenho ser reconhecido de longe.
 */
export function Bola({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <clipPath id="bola-recorte">
          <circle cx="24" cy="24" r="22" />
        </clipPath>
      </defs>
      <g clipPath="url(#bola-recorte)">
        <rect x="0" y="0" width="48" height="24" fill="var(--bola-topo, #f2e34a)" />
        <rect x="0" y="24" width="48" height="24" fill="var(--bola-base, #f04b32)" />
      </g>
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      {/* A costura da bola, em arco. */}
      <path
        d="M4 24c8-9 32-9 40 0"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * Ondulação de areia — a marca que o rodo deixa na quadra depois de passada.
 * Serve de divisor entre seções, no lugar de uma linha reta qualquer.
 */
export function Ondas({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M0 ${12 + i * 10}c150-${8 - i * 2} 250 ${8 + i * 2} 400 0s250-${
            8 - i * 2
          } 400 0 250 ${8 + i * 2} 400 0`}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.5 - i * 0.13}
        />
      ))}
    </svg>
  );
}

/**
 * A parábola de uma bola por cima da rede, com a bolinha correndo o traçado.
 *
 * É o único elemento animado que representa o jogo em si, e por isso aparece uma
 * vez só na página — no fecho, junto do convite para treinar. Sem isso, seria mais
 * um enfeite; usado uma vez, é o gesto do esporte. A animação respeita
 * `prefers-reduced-motion` (ver globals.css): sem movimento, fica só o traçado.
 */
export function Trajetoria({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 600 200" fill="none" aria-hidden="true">
      {/* Linha da areia. */}
      <line
        x1="0"
        y1="176"
        x2="600"
        y2="176"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Rede, no meio da quadra. */}
      <line
        x1="300"
        y1="176"
        x2="300"
        y2="96"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <line
        x1="288"
        y1="96"
        x2="312"
        y2="96"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
      {/* O traçado do golpe. */}
      <path
        id="trajetoria-arco"
        className="trajetoria__arco"
        d="M40 168C40 168 150 24 300 24s260 144 260 144"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5 7"
        opacity="0.6"
      />
      <circle className="trajetoria__bola" r="7" fill="var(--color-lime-ct)">
        <animateMotion
          dur="3.4s"
          repeatCount="indefinite"
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="spline"
          keySplines="0.45 0 0.55 1"
        >
          <mpath href="#trajetoria-arco" />
        </animateMotion>
      </circle>
    </svg>
  );
}
