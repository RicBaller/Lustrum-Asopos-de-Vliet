import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Event {
  date: string;
  name: string;
  desc: string;
  tag?: string;
  highlight?: boolean;
}

@Component({
  selector: 'app-programma',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="programma" id="programma">
      <div class="programma-inner">
        <header class="programma-header">
          <h2 class="section-title">PROGRAMMA</h2>
          <a routerLink="/activiteiten" class="view-all">Bekijk alles →</a>
        </header>

        <div class="events-list">
          @for (event of events; track event.name; let i = $index) {
            <article class="event-card" [class.event-card--highlight]="event.highlight">
              <div class="event-image">
                <div class="event-img-placeholder">
                  <div class="event-img-inner"></div>
                </div>
              </div>
              <div class="event-info">
                @if (event.tag) {
                  <span class="event-tag">{{ event.tag }}</span>
                }
                <time class="event-date">{{ event.date }}</time>
                <h3 class="event-name">{{ event.name }}</h3>
                <p class="event-desc">{{ event.desc }}</p>
              </div>
              <div class="event-number">
                <span>0{{ i + 1 }}</span>
              </div>
            </article>
          }
        </div>
      </div>

      <!-- Wave to archief section -->
      <div class="programma-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C200,20 400,120 720,60 C1000,0 1200,100 1440,50 L1440,120 L0,120 Z" fill="var(--primary-fixed)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .programma {
      position: relative;
      background: var(--surface);
      padding: var(--spacing-section) 0;
      overflow: hidden;
    }

    .programma-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-gutter);
    }

    .programma-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 4rem;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: clamp(3rem, 8vw, 7rem);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .view-all {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--secondary);
      letter-spacing: 0.05em;
      transition: letter-spacing 0.2s;
    }

    .view-all:hover {
      letter-spacing: 0.1em;
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .event-card {
      display: grid;
      grid-template-columns: 220px 1fr 80px;
      gap: 2.5rem;
      align-items: center;
      padding: 2.75rem 0;
      border-top: 0;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
    }

    .event-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--surface-highest);
    }

    .event-card:hover {
      background: var(--surface-low);
      border-radius: var(--radius-lg);
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      margin: 0 -1.5rem;
    }

    .event-card--highlight .event-name {
      color: var(--primary);
    }

    .event-image {
      flex-shrink: 0;
    }

    .event-img-placeholder {
      width: 220px;
      height: 140px;
      border-radius: var(--radius-xl);
      background: var(--surface-highest);
      overflow: hidden;
      position: relative;
    }

    .event-card:nth-child(1) .event-img-placeholder { background: #58007a; }
    .event-card:nth-child(2) .event-img-placeholder { background: #7a0050; }
    .event-card:nth-child(3) .event-img-placeholder { background: #004d6e; }
    .event-card:nth-child(4) .event-img-placeholder { background: #6e3800; }

    .event-img-inner {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 60% 40%, rgba(255, 144, 98, 0.2), transparent 60%);
    }

    .event-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .event-tag {
      display: inline-block;
      background: var(--secondary-container);
      color: var(--secondary);
      font-family: var(--font-body);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 0.2rem 0.75rem;
      border-radius: var(--radius-pill);
      align-self: flex-start;
    }

    .event-date {
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .event-name {
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .event-desc {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 560px;
    }

    .event-number {
      text-align: right;
      color: var(--surface-highest);
    }

    .event-number span {
      font-family: var(--font-display);
      font-size: 3.5rem;
      font-weight: 700;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .programma-wave {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .programma-wave svg {
      display: block;
      width: 100%;
      height: 120px;
    }

    @media (max-width: 768px) {
      .event-card {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .event-image { display: none; }
      .event-number { display: none; }
    }
  `]
})
export class Programma {
  readonly events: Event[] = [
    {
      date: '24 MEI',
      name: 'OPENINGSFEEST',
      desc: 'De stap aanvang hiervan. Een nacht waar grenzen vervagen en het organisme ontwaakt.',
    },
    {
      date: '01 JUN',
      name: 'DELERIUM FESTIVAL',
      desc: 'Terwijl lang non-stop energie aan de Vliet. De grootste line-up in onze geschiedenis.',
      tag: 'uitverkocht',
      highlight: true,
    },
    {
      date: '08 JUN',
      name: 'LUSTRUMDINER',
      desc: 'Een moment van verbisoning in verbinding te maken van de chaos. Chique met een randje.',
    },
    {
      date: '15 JUN',
      name: 'DIES NATALIS BORREL',
      desc: 'Asopos viert haar verjaardag. Rauw, intiem, onvergetelijk.',
    },
  ];
}
