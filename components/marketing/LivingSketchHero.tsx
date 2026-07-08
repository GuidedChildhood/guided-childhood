'use client'

import type { CSSProperties } from 'react'

// The living sketch: the cliff and balloon scene JP set as the house
// illustration style, drawn as layered SVG so the lines sketch themselves on,
// the 16 balloon floats and tugs, and the sea of likes rises and swirls
// below. A rough displacement filter gives the hand held pen feel, and a
// slow boil keeps it alive rather than frozen. Everything settles to the
// finished drawing under reduced motion, so the picture always lands.
//
// This is the prototype of the motion language in animation-system-plan.md.
// Colours follow the reference (red balloon and hearts, blue hoodie) so the
// scene reads as the one JP handed over.

export default function LivingSketchHero({ size = 260 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
      <svg viewBox="0 0 400 400" width="100%" height="100%" role="img">
        <defs>
          <filter id="gc-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <style>{`
          .gc-ink { stroke: #1f1b16; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
          .gc-ink-thin { stroke: #1f1b16; stroke-width: 2; fill: none; stroke-linecap: round; }
          .gc-red { fill: #E23B2E; }
          .gc-blue { fill: #2C6FB5; }
          .gc-white { fill: #ffffff; }
          .gc-boil { transform-box: fill-box; transform-origin: center; }
          .gc-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }

          @media (prefers-reduced-motion: no-preference) {
            .gc-draw { stroke-dashoffset: 1; animation: gc-draw 1s ease forwards; }
            .gc-fade { opacity: 0; animation: gc-fade 0.7s ease forwards; }
            .gc-scene .gc-boil { animation: gc-boil 3.2s ease-in-out infinite; }
            .gc-balloon { animation: gc-float 4.5s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
            .gc-noti { animation: gc-rise var(--dur, 6s) ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
          }
          @keyframes gc-draw { to { stroke-dashoffset: 0; } }
          @keyframes gc-fade { to { opacity: 1; } }
          @keyframes gc-boil {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(0.7px, -0.5px) rotate(0.2deg); }
            66% { transform: translate(-0.6px, 0.5px) rotate(-0.16deg); }
          }
          @keyframes gc-float {
            0%, 100% { transform: translateY(0) rotate(-1.5deg); }
            50% { transform: translateY(-7px) rotate(1.5deg); }
          }
          @keyframes gc-rise {
            0% { transform: translateY(6px) rotate(-4deg); opacity: 0.85; }
            50% { transform: translateY(-6px) rotate(4deg); opacity: 1; }
            100% { transform: translateY(6px) rotate(-4deg); opacity: 0.85; }
          }
          .gc-d1 { animation-delay: 0s; } .gc-d2 { animation-delay: 0.4s; }
          .gc-d3 { animation-delay: 0.9s; } .gc-d4 { animation-delay: 1.5s; }
        `}</style>

        <g className="gc-scene" filter="url(#gc-rough)">

          {/* Cliff plateau and face */}
          <g>
            <path className="gc-ink gc-draw gc-d1" pathLength="1" d="M24 252 Q120 246 182 252" />
            <path className="gc-ink gc-draw gc-d1" pathLength="1" d="M182 252 C196 300 192 344 204 366" />
            <path className="gc-ink-thin gc-draw gc-d2" pathLength="1" d="M96 268 L84 292" />
            <path className="gc-ink-thin gc-draw gc-d2" pathLength="1" d="M126 270 L116 296" />
            <path className="gc-ink-thin gc-draw gc-d2" pathLength="1" d="M156 270 L148 298" />
          </g>

          {/* The old path sign */}
          <g>
            <path className="gc-ink gc-draw gc-d2" pathLength="1" d="M70 250 L70 208" />
            <rect className="gc-white" x="36" y="176" width="74" height="30" rx="3" />
            <rect className="gc-ink gc-draw gc-d2" pathLength="1" x="36" y="176" width="74" height="30" rx="3" />
            <text className="gc-fade gc-d3" x="73" y="190" textAnchor="middle" fontFamily="'Comic Sans MS','Chalkboard',cursive" fontSize="8" fontWeight="700" fill="#1f1b16">THE OLD</text>
            <text className="gc-fade gc-d3" x="73" y="201" textAnchor="middle" fontFamily="'Comic Sans MS','Chalkboard',cursive" fontSize="8" fontWeight="700" fill="#1f1b16">&#8592; PATH</text>
          </g>

          {/* The child at the edge */}
          <g className="gc-boil">
            {/* legs */}
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M182 210 L178 248" />
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M196 210 L200 248" />
            <ellipse className="gc-white" cx="176" cy="250" rx="9" ry="4" />
            <ellipse className="gc-ink-thin gc-draw gc-d3" pathLength="1" cx="176" cy="250" rx="9" ry="4" />
            <ellipse className="gc-white" cx="202" cy="250" rx="9" ry="4" />
            <ellipse className="gc-ink-thin gc-draw gc-d3" pathLength="1" cx="202" cy="250" rx="9" ry="4" />
            {/* hoodie */}
            <path className="gc-blue gc-fade gc-d3" d="M170 172 Q189 162 208 172 L204 212 Q189 218 174 212 Z" />
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M170 172 Q189 162 208 172 L204 212 Q189 218 174 212 Z" />
            {/* arms */}
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M172 176 L166 210" />
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M206 176 L212 206" />
            {/* head */}
            <circle className="gc-white" cx="189" cy="150" r="16" />
            <circle className="gc-ink gc-draw gc-d2" pathLength="1" cx="189" cy="150" r="16" />
            {/* hair scribble */}
            <path className="gc-ink gc-draw gc-d3" pathLength="1" d="M175 143 Q180 132 189 135 Q196 130 203 140" />
            {/* face, looking down */}
            <circle cx="185" cy="154" r="1.4" fill="#1f1b16" />
            <circle cx="194" cy="154" r="1.4" fill="#1f1b16" />
            <path className="gc-ink-thin gc-draw gc-d4" pathLength="1" d="M185 159 Q189 161 193 159" />
            {/* notice marks */}
            <path className="gc-ink-thin gc-draw gc-d4" pathLength="1" d="M210 138 L216 134" />
            <path className="gc-ink-thin gc-draw gc-d4" pathLength="1" d="M212 145 L219 143" />
          </g>

          {/* The 16 balloon */}
          <g className="gc-balloon">
            <path className="gc-ink-thin gc-draw gc-d3" pathLength="1" d="M205 100 Q198 150 178 205" />
            <ellipse className="gc-red" cx="207" cy="70" rx="27" ry="31" />
            <ellipse className="gc-ink gc-draw gc-d2" pathLength="1" cx="207" cy="70" rx="27" ry="31" />
            <path className="gc-red" d="M203 100 L211 100 L207 106 Z" />
            <text className="gc-fade gc-d3" x="207" y="77" textAnchor="middle" fontFamily="'Comic Sans MS','Chalkboard',cursive" fontSize="20" fontWeight="700" fill="#ffffff">16</text>
          </g>

          {/* The sea of likes, rising and swirling */}
          <g>
            <path className="gc-ink-thin gc-draw gc-d4" pathLength="1" d="M232 320 q14 -12 28 0 t28 0" opacity="0.5" />
            <path className="gc-ink-thin gc-draw gc-d4" pathLength="1" d="M250 348 q16 -12 32 0 t32 0" opacity="0.5" />

            <g className="gc-noti gc-d1" style={{ '--dur': '5.5s' } as CSSProperties}>
              <path className="gc-red" d="M250 300 c-4 -6 -13 -3 -13 4 c0 6 13 12 13 12 c0 0 13 -6 13 -12 c0 -7 -9 -10 -13 -4 z" />
            </g>
            <g className="gc-noti gc-d2" style={{ '--dur': '6.5s' } as CSSProperties}>
              <rect className="gc-blue" x="286" y="300" width="24" height="20" rx="4" />
              <path className="gc-white" d="M292 312 l0 -4 l3 -4 l1 4 l4 0 l-1 8 l-6 0 z" />
            </g>
            <g className="gc-noti gc-d3" style={{ '--dur': '5s' } as CSSProperties}>
              <rect className="gc-white" x="322" y="316" width="22" height="18" rx="4" />
              <rect className="gc-ink-thin" x="322" y="316" width="22" height="18" rx="4" fill="none" />
              <circle cx="333" cy="322" r="2.4" fill="#1f1b16" />
              <path d="M328 330 q5 -5 10 0" className="gc-ink-thin" fill="none" />
            </g>
            <g className="gc-noti gc-d4" style={{ '--dur': '7s' } as CSSProperties}>
              <path className="gc-red" d="M270 338 c-4 -6 -13 -3 -13 4 c0 6 13 12 13 12 c0 0 13 -6 13 -12 c0 -7 -9 -10 -13 -4 z" />
            </g>
            <g className="gc-noti gc-d2" style={{ '--dur': '6s' } as CSSProperties}>
              <rect className="gc-red" x="300" y="336" width="20" height="17" rx="4" />
              <text x="310" y="349" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="800" fill="#ffffff">!</text>
            </g>
            <g className="gc-noti gc-d1" style={{ '--dur': '5.8s' } as CSSProperties}>
              <path className="gc-blue" d="M226 336 c-3 -5 -11 -2 -11 3 c0 5 11 10 11 10 c0 0 11 -5 11 -10 c0 -5 -8 -8 -11 -3 z" opacity="0.9" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
