import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-strip',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta-strip">
      <div class="cta-inner">
        <div class="cta-text">
          <h2 class="cta-title">WORD DELIRISCH<br>WEES DELIRISCH</h2>
          <p class="cta-sub">Doe mee! Kom in dezelfde toestand van geestelijke waanzin. Kom naar de delirische activiteiten.</p>
        </div>
        <div class="cta-actions">
          <a routerLink="/activiteiten" class="cta-btn">
            <span>Bekijk activiteiten</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Wave back to surface -->
      <div class="cta-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,30 1440,50 L1440,100 L0,100 Z" fill="var(--surface)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .cta-strip {
      position: relative;
      background: var(--surface);
      padding: var(--spacing-section) var(--spacing-gutter) calc(var(--spacing-section) + 60px);
      overflow: hidden;
    }

    .cta-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      flex-wrap: wrap;
    }

    .cta-title {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 5vw, 4.5rem);
      font-weight: 700;
      color: var(--primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .cta-sub {
      font-family: var(--font-body);
      font-size: 1.0625rem;
      color: var(--text-secondary);
      margin-top: 1rem;
      max-width: 420px;
    }

    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--primary);
      color: var(--on-primary);
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      padding: 1.125rem 2.5rem;
      border-radius: var(--radius-pill);
      transition: transform 0.2s, background 0.2s;
      white-space: nowrap;
    }

    .cta-btn:hover {
      transform: translateY(-3px);
      background: var(--primary);
      filter: brightness(1.12);
      color: var(--on-primary);
    }

    .cta-wave {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .cta-wave svg {
      display: block;
      width: 100%;
      height: 100px;
    }
  `]
})
export class CtaStrip {}
