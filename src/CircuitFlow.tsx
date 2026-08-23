/** Circuit paths mapped to the AI bust silhouette (viewBox 0 0 1000 1100). */
const PATHS = [
  // Scalp / forehead topography
  "M420 170 C470 120 560 110 620 150 C670 185 690 230 705 290",
  "M390 210 C460 155 560 145 640 185 C700 220 730 270 745 330",
  "M360 260 C450 190 565 175 655 225 C720 265 755 320 760 375",
  // Temple → cheek
  "M330 320 C400 280 470 300 520 360 C560 410 575 470 560 530",
  "M300 390 C380 340 470 355 530 420 C575 470 585 540 560 600",
  // Nose / mid face ridges
  "M505 310 C515 370 520 430 510 495 C500 550 485 590 470 630",
  "M545 300 C560 365 565 435 550 505 C535 565 515 610 490 650",
  // Neck fiber strands
  "M430 640 C445 700 455 760 450 820 C445 880 430 930 410 970",
  "M470 650 C490 715 505 780 510 845 C515 905 505 955 485 1000",
  "M510 645 C535 710 560 775 575 845 C585 905 580 955 560 1005",
  "M550 640 C580 705 615 770 640 840 C655 900 655 955 635 1005",
  // Collarbone / shoulder rings
  "M340 720 C400 690 480 685 560 700 C640 715 710 750 760 800",
  "M300 780 C380 740 480 730 575 755 C670 780 740 830 790 890",
  "M280 850 C370 800 480 790 590 820 C690 850 760 910 810 980",
  // Shoulder spiral
  "M720 720 C780 700 840 720 870 780 C895 835 885 900 840 940",
  "M700 780 C770 760 835 790 855 850 C870 900 850 955 800 985",
] as const;

type Pulse = {
  pathIndex: number;
  delay: number;
  duration: number;
};

const PULSES: Pulse[] = Array.from({ length: 28 }, (_, i) => ({
  pathIndex: i % PATHS.length,
  delay: (i * 0.38) % 6.5,
  duration: 2.4 + (i % 5) * 0.35,
}));

function CircuitFlow() {
  return (
    <svg
      className="circuit-flow"
      viewBox="0 0 1000 1100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="circuitGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="packetBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="packetCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="45%" stopColor="#dce6ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9db4ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="circuit-flow__wires" filter="url(#circuitGlow)">
        {PATHS.map((d, i) => (
          <path
            key={`wire-${i}`}
            className="circuit-flow__wire"
            d={d}
            style={{ animationDelay: `${(i % 7) * 0.35}s` }}
          />
        ))}
      </g>

      <g filter="url(#packetBloom)">
        {PULSES.map((pulse, i) => (
          <circle
            key={`packet-${i}`}
            className="circuit-flow__packet"
            r={i % 3 === 0 ? 4.2 : 3}
            fill="url(#packetCore)"
          >
            <animateMotion
              dur={`${pulse.duration}s`}
              begin={`${pulse.delay}s`}
              repeatCount="indefinite"
              rotate="auto"
              path={PATHS[pulse.pathIndex]}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
          </circle>
        ))}
      </g>

      {/* Hot node flashes along key junctions */}
      {[
        [520, 360],
        [560, 530],
        [470, 630],
        [510, 845],
        [640, 840],
        [760, 800],
        [870, 780],
        [420, 170],
        [705, 290],
      ].map(([cx, cy], i) => (
        <circle
          key={`node-${i}`}
          className="circuit-flow__node"
          cx={cx}
          cy={cy}
          r={2.4}
          style={{ animationDelay: `${i * 0.45}s` }}
        />
      ))}
    </svg>
  );
}

export default CircuitFlow;
