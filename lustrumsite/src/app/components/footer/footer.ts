import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer" id="contact">
      <div class="footer-inner">
        <div class="footer-brand">
          <p class="footer-logo">DELERIUM</p>
          <p class="footer-sub">© 2024 Lustrum Commissie — Het Electrisch Organisme</p>
          <div class="footer-social">
            <a href="#" class="social-pill" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="#" class="social-pill" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        <nav class="footer-nav">
          <h4 class="footer-nav-title">Navigatie</h4>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/activiteiten">Activiteiten</a></li>
            <li><a routerLink="/" fragment="media">Media</a></li>
            <li><a routerLink="/" fragment="shop">Shop</a></li>
            <li><a routerLink="/" fragment="contact">Contact</a></li>
          </ul>
        </nav>

        <nav class="footer-nav">
          <h4 class="footer-nav-title">Juridisch</h4>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Statuten</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--surface);
      padding: 4rem var(--spacing-gutter) 3rem;
    }

    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 5rem;
      align-items: start;
    }

    .footer-logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.08em;
      margin-bottom: 0.75rem;
    }

    .footer-sub {
      font-family: var(--font-body);
      font-size: 0.8125rem;
      color: var(--text-muted);
      max-width: 260px;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .footer-social {
      display: flex;
      gap: 0.75rem;
    }

    .social-pill {
      width: 42px;
      height: 42px;
      background: var(--surface-low);
      border-radius: var(--radius-pill);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      transition: background 0.2s, color 0.2s;
    }

    .social-pill:hover {
      background: var(--surface-highest);
      color: var(--primary);
    }

    .footer-nav-title {
      font-family: var(--font-body);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .footer-nav ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    .footer-nav a {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      color: var(--text-secondary);
      transition: color 0.2s;
    }

    .footer-nav a:hover {
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .footer-inner {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }
  `]
})
export class Footer {}
