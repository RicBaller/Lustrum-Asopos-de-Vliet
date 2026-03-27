import { ChangeDetectionStrategy, Component } from '@angular/core';

interface KomendEvent {
  date: string;
  month: string;
  name: string;
  desc: string;
  img: string;
}

@Component({
  selector: 'app-komende-chaos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="kc-section">
      <div class="kc-inner">

        <header class="kc-header">
          <h2 class="kc-title">KOMENDE<br>CHAOS</h2>
          <p class="kc-subtitle">
            Bereid je voor op de hoogtepunten van het jaar. Drie evenementen die de
            geschiedenisboeken in gaan.
          </p>
        </header>

        <div class="kc-events">
          @for (event of events; track event.name; let i = $index) {
            <article class="kc-event" [class.kc-event--reverse]="i % 2 === 1">
              <div class="kc-img-wrap">
                <img [src]="event.img" [alt]="event.name" class="kc-img" />
              </div>
              <div class="kc-content">
                <time class="kc-date">{{ event.date }}. {{ event.month }}</time>
                <h3 class="kc-name">{{ event.name }}</h3>
                <p class="kc-desc">{{ event.desc }}</p>
                <a href="#" class="kc-btn">Details</a>
              </div>
            </article>
          }
        </div>

      </div>
    </section>
  `,
  styles: [`
    .kc-section {
      position: relative;
      background: var(--primary);
      background-image: radial-gradient(var(--surface-mid) 1px, transparent 1px);
      background-size: 28px 28px;
      padding: var(--spacing-section) 0;
      overflow: hidden;
    }

    .kc-inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 var(--spacing-gutter);
    }

    /* ── Header ── */
    .kc-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: end;
      gap: 2rem;
      margin-bottom: 5rem;
    }

    .kc-title {
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 9vw, 6.5rem);
      font-weight: 800;
      color: var(--primary-contrast);
      line-height: 0.95;
      letter-spacing: -0.02em;
    }

    .kc-subtitle {
      font-family: var(--font-body);
      font-size: 0.95rem;
      line-height: 1.65;
      color: var(--primary-contrast);
      align-self: end;
      padding-bottom: 0.25rem;
    }

    /* ── Events ── */
    .kc-events {
      display: flex;
      flex-direction: column;
      gap: 4.5rem;
    }

    .kc-event {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .kc-event--reverse {
      direction: rtl;
    }

    .kc-event--reverse > * {
      direction: ltr;
    }

    /* ── Image ── */
    .kc-img-wrap {
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      overflow: hidden;
      max-width: 320px;
      width: 100%;
      justify-self: center;
    }

    .kc-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* ── Content ── */
    .kc-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .kc-date {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--primary-contrast);
      text-transform: uppercase;
    }

    .kc-name {
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 4vw, 2.75rem);
      font-weight: 800;
      color: var(--primary-contrast);
      letter-spacing: -0.02em;
      line-height: 1.05;
      text-transform: uppercase;
    }

    .kc-desc {
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.65;
      color: var(--primary-contrast);
      margin-top: 0.25rem;
    }

    .kc-btn {
      display: inline-block;
      margin-top: 0.5rem;
      padding: 0.5rem 1.5rem;
      border: 1.5px solid var(--surface-bright);
      background: var(--surface-bright);
      border-radius: var(--radius-pill);
      color: var(--primary-contrast);
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      align-self: flex-start;
      transition: background 0.2s, color 0.2s;
    }

    .kc-btn:hover {
      background: var(--secondary);
      color: var(--on-secondary);
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .kc-header {
        grid-template-columns: 1fr;
      }

      .kc-event,
      .kc-event--reverse {
        grid-template-columns: 1fr;
        direction: ltr;
      }

      .kc-img-wrap {
        max-width: 220px;
      }
    }
  `],
})
export class KomendeChaos {
  readonly events: KomendEvent[] = [
    {
      date: '01',
      month: 'JUN',
      name: 'LUSTRUM GALA',
      desc: 'Een avond van ongekende grandeur en stijl. Trek je mooiste pak aan voor een nacht die nooit mag eindigen.',
      img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
    },
    {
      date: '15',
      month: 'JUL',
      name: 'DELERIUM RAVE',
      desc: 'Zestien uur lang non-stop techno in de loods. Alleen voor de echte die-hards van de Vliet.',
      img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    },
    {
      date: '26',
      month: 'AUG',
      name: 'VLIET REGATTA',
      desc: 'De ultieme krachtmeting op het water. Laat zien uit welk hout je gesneden bent tijdens de Lustrum editie.',
      img: 'https://images.unsplash.com/photo-1544097424-8d7b4c1a3c47?w=600&q=80',
    },
  ];
}
