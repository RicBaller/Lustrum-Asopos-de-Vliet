import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-preloader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preloader" [class.reveal]="revealing()" [class.done]="done()">
      <!-- Animated rowing boat scene -->
      <div class="scene">
        <div class="water-bg"></div>

        <!-- SVG rowing boat -->
        <div class="boat-wrap">
          <svg
            class="boat"
            viewBox="0 0 200 120"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <!-- Water ripple lines -->
            <ellipse class="ripple r1" cx="100" cy="95" rx="70" ry="6" />
            <ellipse class="ripple r2" cx="100" cy="95" rx="50" ry="4" />

            <!-- Hull -->
            <path
              d="M30 70 Q100 90 170 70 L160 82 Q100 100 40 82 Z"
              fill="#F06C30"
            />
            <!-- Hull highlight -->
            <path
              d="M40 71 Q100 88 160 71 L158 74 Q100 91 42 74 Z"
              fill="#ff8c55"
              opacity="0.4"
            />
            <!-- Gunwale -->
            <path
              d="M30 70 Q100 85 170 70"
              fill="none"
              stroke="#d45829"
              stroke-width="2"
            />

            <!-- Rower body -->
            <rect x="90" y="46" width="18" height="24" rx="4" fill="#7d00aa" />
            <!-- Rower head -->
            <circle cx="99" cy="40" r="8" fill="#f0d0ff" />
            <!-- Shirt stripe -->
            <rect x="90" y="52" width="18" height="4" rx="1" fill="#00ffff" opacity="0.7" />

            <!-- Oar left -->
            <g class="oar oar-left">
              <line x1="80" y1="68" x2="28" y2="82" stroke="#c8a060" stroke-width="3" stroke-linecap="round" />
              <ellipse cx="27" cy="83" rx="10" ry="4" fill="#c8a060" opacity="0.9" transform="rotate(-15 27 83)" />
            </g>
            <!-- Oar right -->
            <g class="oar oar-right">
              <line x1="118" y1="68" x2="172" y2="82" stroke="#c8a060" stroke-width="3" stroke-linecap="round" />
              <ellipse cx="173" cy="83" rx="10" ry="4" fill="#c8a060" opacity="0.9" transform="rotate(15 173 83)" />
            </g>

            <!-- Bow decoration -->
            <path d="M165 74 L172 68 L172 76 Z" fill="#F06C30" />
          </svg>
        </div>

        <!-- Splash particles -->
        <div class="splashes">
          @for (s of splashes; track s) {
            <span class="splash" [style.left]="s.left" [style.animation-delay]="s.delay"></span>
          }
        </div>

        <!-- Logo overlay -->
        <div class="brand">
          <span class="brand-title">Delerium</span>
          <span class="brand-sub">Lustrum Asopos de Vliet</span>
        </div>
      </div>

      <!-- Wave curtain reveal overlay -->
      <div class="curtain">
        <svg
          class="curtain-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,0 L0,0 Z"
            fill="#3f0059"
          />
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .preloader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #3f0059;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* ── Scene ── */
    .scene {
      position: relative;
      width: 340px;
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .water-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: linear-gradient(180deg, #1a003a 0%, #0d001e 100%);
      border-radius: 50% 50% 0 0 / 30px 30px 0 0;
      opacity: 0.5;
    }

    /* ── Boat ── */
    .boat-wrap {
      position: relative;
      z-index: 2;
      animation: bobAndRow 2s ease-in-out infinite;
    }

    .boat {
      width: 260px;
      height: auto;
      filter: drop-shadow(0 8px 24px rgba(240,108,48,0.35));
    }

    @keyframes bobAndRow {
      0%   { transform: translateY(0px) rotate(0deg); }
      25%  { transform: translateY(-6px) rotate(-0.8deg); }
      50%  { transform: translateY(-2px) rotate(0deg); }
      75%  { transform: translateY(-8px) rotate(0.8deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    /* ── Oars ── */
    .oar-left {
      transform-origin: 80px 68px;
      animation: rowLeft 2s ease-in-out infinite;
    }
    .oar-right {
      transform-origin: 118px 68px;
      animation: rowRight 2s ease-in-out infinite;
    }

    @keyframes rowLeft {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(20deg); }
      50%  { transform: rotate(0deg); }
      75%  { transform: rotate(-20deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes rowRight {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(-20deg); }
      50%  { transform: rotate(0deg); }
      75%  { transform: rotate(20deg); }
      100% { transform: rotate(0deg); }
    }

    /* ── Ripples ── */
    .ripple {
      fill: none;
      stroke: #00ffff;
      stroke-width: 1.5;
      opacity: 0;
      animation: rippleAnim 2s ease-out infinite;
    }
    .r1 { animation-delay: 0s; }
    .r2 { animation-delay: 0.5s; }

    @keyframes rippleAnim {
      0%   { opacity: 0; rx: 70; ry: 6; }
      20%  { opacity: 0.5; }
      100% { opacity: 0; rx: 90; ry: 9; }
    }

    /* ── Splashes ── */
    .splashes {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 1;
    }
    .splash {
      position: absolute;
      bottom: 0;
      width: 3px;
      height: 12px;
      background: #00ffff;
      border-radius: 2px;
      opacity: 0;
      animation: splashAnim 2s ease-in-out infinite;
    }

    @keyframes splashAnim {
      0%   { opacity: 0; transform: translateY(0) scaleY(0); }
      30%  { opacity: 0.7; transform: translateY(-14px) scaleY(1); }
      70%  { opacity: 0.3; transform: translateY(-6px) scaleY(0.5); }
      100% { opacity: 0; transform: translateY(0) scaleY(0); }
    }

    /* ── Brand text ── */
    .brand {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 3;
      pointer-events: none;
    }
    .brand-title {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #ffffff;
      text-shadow: 0 0 30px rgba(240,108,48,0.6);
    }
    .brand-sub {
      display: block;
      font-family: 'Manrope', sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #c080dd;
      margin-top: 4px;
    }

    /* ── Curtain wave ── */
    .curtain {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 10;
      /* Starts as a full block covering everything */
      background: #3f0059;
      /* Clip from bottom up: full screen visible */
      clip-path: inset(0 0 0 0);
    }

    .curtain-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 120px;
      /* Wave sits at the bottom edge of the curtain */
    }

    /* ── Reveal animation ── */
    .preloader.reveal .curtain {
      animation: curtainUp 1.4s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    @keyframes curtainUp {
      0%   { clip-path: inset(0 0 0 0); }
      100% { clip-path: inset(0 0 100% 0); }
    }

    /* ── When done: hide entire preloader ── */
    .preloader.done {
      display: none;
    }
  `],
})
export class Preloader implements OnInit {
  hidden = output<void>();

  revealing = signal(false);
  done = signal(false);

  splashes = [
    { left: '22%', delay: '0s' },
    { left: '28%', delay: '0.3s' },
    { left: '68%', delay: '0.15s' },
    { left: '74%', delay: '0.45s' },
  ];

  ngOnInit(): void {
    // Start reveal after boat animation plays for a bit
    setTimeout(() => {
      this.revealing.set(true);
    }, 1800);

    // After curtain animation finishes, hide completely and emit event
    setTimeout(() => {
      this.done.set(true);
      this.hidden.emit();
    }, 1800 + 1400 + 100);
  }
}
