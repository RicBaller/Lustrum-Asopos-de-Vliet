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
      <!-- The whole preloader container slides down at the end. The top edge is a wave. -->
      <div class="water-container">
        <!-- SVG Canvas for the Rowers -->
        <div class="boat-wrapper">
          <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="rowing-svg">
            <defs>
              <!-- Linker Riem -->
              <g id="oar-left">
                <g class="anim-oar-L">
                  <!-- Riem as -->
                  <line x1="0" y1="0" x2="-160" y2="0" stroke="#222" stroke-width="4" stroke-linecap="round"/>
                  <!-- Riem blad -->
                  <path d="M -160 -4 L -200 -7 L -205 7 L -160 4 Z" fill="#F06C30" stroke="#222" stroke-linejoin="round"/>
                </g>
              </g>

              <!-- Rechter Riem -->
              <g id="oar-right">
                <g class="anim-oar-R">
                  <!-- Riem as -->
                  <line x1="0" y1="0" x2="160" y2="0" stroke="#222" stroke-width="4" stroke-linecap="round"/>
                  <!-- Riem blad -->
                  <path d="M 160 -4 L 200 -7 L 205 7 L 160 4 Z" fill="#F06C30" stroke="#222" stroke-linejoin="round"/>
                </g>
              </g>

              <!-- Individuele Roeier -->
              <g id="rower">
                <!-- Schouders/lichaam -->
                <ellipse cx="0" cy="0" rx="18" ry="12" fill="#7d00aa" stroke="#222" stroke-width="1.5"/>
                <!-- Hoofd -->
                <circle cx="0" cy="-3" r="9" fill="#f0d0ff" stroke="#222" stroke-width="1.5"/>
              </g>
            </defs>

            <!-- 2. Bewegende Waterrimpels -->
            <g stroke="#00ffff" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6">
              <g class="ripple ripple-1">
                <path d="M 280 150 Q 400 180 520 150" />
                <path d="M 240 250 Q 400 280 560 250" />
              </g>
              <g class="ripple ripple-2">
                <path d="M 250 100 Q 400 130 550 100" />
                <path d="M 290 350 Q 400 380 510 350" />
              </g>
              <g class="ripple ripple-3">
                <path d="M 260 50 Q 400 80 540 50" />
                <path d="M 230 420 Q 400 450 570 420" />
              </g>
            </g>

            <!-- 3. De Roeiboot (Hull) -->
            <g id="boat-group">
              <!-- Vorm van de boot -->
              <path d="M 400 60 
                        C 430 180, 435 420, 400 540 
                        C 365 420, 370 180, 400 60 Z" 
                    fill="#ECDC6E" stroke="#222" stroke-width="2" stroke-linejoin="round"/>
              
              <!-- Middenlijn van de boot -->
              <line x1="400" y1="60" x2="400" y2="540" stroke="#000000" stroke-width="2" />
              
              <!-- Zitplaatsen (bankjes) -->
              <line x1="388" y1="185" x2="412" y2="185" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
              <line x1="388" y1="265" x2="412" y2="265" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
              <line x1="388" y1="345" x2="412" y2="345" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
              <line x1="388" y1="425" x2="412" y2="425" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>

              <!-- 4. Riemen & Roeiers (Quad Scull) -->
              <use href="#oar-left" x="385" y="180" />
              <use href="#oar-right" x="415" y="180" />
              <use href="#rower" x="400" y="180" />

              <use href="#oar-left" x="385" y="260" />
              <use href="#oar-right" x="415" y="260" />
              <use href="#rower" x="400" y="260" />

              <use href="#oar-left" x="385" y="340" />
              <use href="#oar-right" x="415" y="340" />
              <use href="#rower" x="400" y="340" />

              <use href="#oar-left" x="385" y="420" />
              <use href="#oar-right" x="415" y="420" />
              <use href="#rower" x="400" y="420" />
            </g>
          </svg>
        </div>

        <!-- Wave Curtain Top -->
        <svg
          class="curtain-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
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
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }

    .water-container {
      position: absolute;
      inset: 0;
      background-color: #3f0059; /* Brand purple */
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      will-change: transform;
    }

    .boat-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: driveBoat 2s cubic-bezier(0.42, 0, 0.58, 1) forwards;
    }

    /* SVG Canvas styling */
    .rowing-svg {
      width: 100%;
      height: 100%;
      max-width: 800px;
      max-height: 800px;
      display: block;
      transform: rotate(180deg);
    }

    /* The wave at the top of the container, currently invisible, shown when sliding */
    .curtain-wave {
      position: absolute;
      top: -119px; /* Sit right above the container */
      left: 0;
      width: 100%;
      height: 120px;
      transform: scaleY(-1); /* Flips it so the flat side matches the container edge */
      opacity: 0; /* Hidden initially until reveal */
    }

    /* ─── Animaties ─── */
    
    /* Beweging boot van boven naar beneden */
    @keyframes driveBoat {
      0% {
        transform: translateY(-100vh);
      }
      100% {
        transform: translateY(0); /* Centers the boat in the window */
      }
    }

    /* Roeislag Animatie - Linker riemen */
    .anim-oar-L {
      animation: oar-sweep-L 2s infinite;
      transform-origin: 0 0;
    }

    /* Roeislag Animatie - Rechter riemen */
    .anim-oar-R {
      animation: oar-sweep-R 2s infinite;
      transform-origin: 0 0;
    }

    @keyframes oar-sweep-L {
      0% { 
        transform: rotate(45deg); 
        animation-timing-function: cubic-bezier(0.2, 0.8, 0.3, 1); 
      }
      40% { 
        transform: rotate(-45deg); 
        animation-timing-function: ease-in-out; 
      }
      100% { 
        transform: rotate(45deg); 
      }
    }

    @keyframes oar-sweep-R {
      0% { 
        transform: rotate(-45deg); 
        animation-timing-function: cubic-bezier(0.2, 0.8, 0.3, 1);
      }
      40% { 
        transform: rotate(45deg); 
        animation-timing-function: ease-in-out;
      }
      100% { 
        transform: rotate(-45deg); 
      }
    }

    /* Waterrimpels Animatie - Simuleert de voorwaartse snelheid */
    .ripple {
      animation: flowDown 2.5s linear infinite;
    }
    .ripple-1 { animation-delay: 0s; }
    .ripple-2 { animation-delay: -0.8s; }
    .ripple-3 { animation-delay: -1.6s; }

    @keyframes flowDown {
        0% { transform: translateY(-50px); opacity: 0; }
        15% { opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translateY(250px); opacity: 0; }
    }


    /* ── Reveal animation ── */
    /* De "golven het scherm openen" -> De hele container glijdt omlaag uit beeld */
    .preloader.reveal .curtain-wave {
      opacity: 1;
    }
    
    .preloader.reveal .water-container {
      animation: openCurtainDown 1.5s cubic-bezier(0.76, 0, 0.24, 1) forwards;
    }

    @keyframes openCurtainDown {
      0% { transform: translateY(0); }
      100% { transform: translateY(110vh); } /* Schuift naar beneden het scherm uit */
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

  ngOnInit(): void {
    // 1. Boat drops in (2s animation). Wait for 2s of rowing.
    setTimeout(() => {
      this.revealing.set(true);
    }, 2000);

    // 2. Curtain glides down (1.5s animation). Done after 2s + 1.5s
    setTimeout(() => {
      this.done.set(true);
      this.hidden.emit();
    }, 3500);
  }
}

