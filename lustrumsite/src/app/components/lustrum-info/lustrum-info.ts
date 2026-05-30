import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, inject } from '@angular/core';

@Component({
  selector: 'app-lustrum-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lustrum-info">
      <div class="lustrum-info__inner">

        <div class="lustrum-info__header">
          <p class="lustrum-info__eyebrow">XIII</p>
          <h2 class="lustrum-info__title">Delirium</h2>
          <p class="lustrum-info__tagline">"Waanzinnigheid"</p>
          <img src="/logo.png" alt="Delirium" class="lustrum-info__logo" />
        </div>

        <div class="lustrum-info__body">
          <p>
            Het dertiende lustrum; een mijlpaal voorbij het voltooide. Waar twaalf symbool staat voor orde en
            afronding, daar doorbreekt dertien het bekende. Het moment waarop het vaste begint te schuiven en
            ruimte maakt voor het onverwachte. Wanneer dan het dertiende uur slaat, voorbij de grenzen van de
            gewone tijd, raken wij los van het ritme dat ons altijd heeft geleid. De klok verliest haar macht,
            minuten vervagen, en wat rest is een zwevende werkelijkheid, ergens tussen herinnering en verbeelding.
          </p>
          <p>
            In deze toestand, die men een delirium zou kunnen noemen, opent zich een andere manier van ervaren.
            Een koortsdroom waarin alles intenser leeft; gedachten vloeien vrijer, grenzen verdwijnen en het
            onmogelijke lijkt ineens vanzelfsprekend. Het is alsof wij, de tijd voorbij zijn gestreefd.
          </p>
          <p>
            Hier in het dertiende uur mag, wat eerst vaststond, buigen; wat verborgen was, mag zichtbaar worden.
            En deze zichtbaarheid komt niet uit het niets. De afgelopen jaren hebben wij als vereniging gebouwd.
            Met enorme toewijding en ambitie vanuit alle kanten van de vereniging.
          </p>
          <p class="lustrum-info__closing">
            In het dertiende uur, in delirische toestand, vieren wij niet alleen wat is geweest, maar vooral
            wat mogelijk wordt wanneer wij samen boven onszelf uitstijgen.
          </p>
          <p class="lustrum-info__sign">Delirium, we gaan de tijd voorbij.</p>
        </div>

      </div>

      <!-- Wave transition to purple Videos section -->
      <div class="lustrum-info__wave-bottom" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C360,120 720,0 1080,80 C1260,110 1380,30 1440,60 L1440,120 L0,120 Z" fill="var(--surface)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .lustrum-info {
      position: relative;
      background: var(--primary-fixed);
      padding: var(--spacing-section) var(--spacing-gutter) calc(var(--spacing-section) + 80px);
      overflow: hidden;
    }

    .lustrum-info__wave-bottom {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .lustrum-info__wave-bottom svg {
      display: block;
      width: 100%;
      height: 120px;
    }

    .lustrum-info__inner {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 4rem 7rem;
      align-items: start;
    }

    /* ── Left: sticky header ──────────────────────────── */

    .lustrum-info__header {
      position: sticky;
      top: 6rem;
    }

    .lustrum-info__eyebrow {
      color: var(--secondary);
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin: 0 0 0.6rem;
    }

    .lustrum-info__title {
      color: var(--surface);
      font-family: var(--font-display);
      font-size: clamp(3rem, 6vw, 5rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 0.9;
      text-transform: uppercase;
      margin: 0 0 0.8rem;
    }

    .lustrum-info__tagline {
      color: var(--surface);
      font-size: 0.9rem;
      font-style: italic;
      font-weight: 700;
      margin: 0;
    }

    .lustrum-info__logo {
      width: 100%;
      max-width: 260px;
      height: auto;
      margin-top: 1.5rem;
      display: block;
      background: #451F64;
      border-radius: 50%;
      padding: 1rem;
    }

    /* ── Right: body text with scroll reveal ──────────── */

    .lustrum-info__body {
      display: flex;
      flex-direction: column;
      gap: 1.6rem;
    }

    .lustrum-info__body p {
      color: var(--surface);
      font-size: 1.05rem;
      line-height: 1.85;
      margin: 0;
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }

    .lustrum-info__body p.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* stagger delays (enter) */
    .lustrum-info__body p:nth-child(1) { transition-delay: 0s; }
    .lustrum-info__body p:nth-child(2) { transition-delay: 0.1s; }
    .lustrum-info__body p:nth-child(3) { transition-delay: 0.18s; }
    .lustrum-info__body p:nth-child(4) { transition-delay: 0.26s; }
    .lustrum-info__body p:nth-child(5) { transition-delay: 0.32s; }

    .lustrum-info__closing {
      color: var(--surface) !important;
      font-weight: 600;
    }

    .lustrum-info__sign {
      color: var(--surface) !important;
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: 0.02em;
    }

    /* ── Responsive ───────────────────────────────────── */

    @media (max-width: 768px) {
      .lustrum-info__inner {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .lustrum-info__header {
        position: static;
      }
    }
  `],
})
export class LustrumInfo implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    const paragraphs: NodeListOf<Element> =
      this.el.nativeElement.querySelectorAll('.lustrum-info__body p');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    paragraphs.forEach(p => this.observer!.observe(p));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

