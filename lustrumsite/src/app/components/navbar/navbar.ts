import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.scrolled]': 'scrolled()' },
  template: `
    <nav class="navbar" [class.scrolled]="scrolled()">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-logo" aria-label="Ga naar home">
          <span class="logo-text">DELERIUM</span>
        </a>

        <ul class="navbar-links">
          <li>
            <a routerLink="/" routerLinkActive="nav-link-active" [routerLinkActiveOptions]="{ exact: true }">
              Home
            </a>
          </li>
          <li>
            <a routerLink="/activiteiten" routerLinkActive="nav-link-active">Activiteiten</a>
          </li>
          <li><a routerLink="/" fragment="media">Media</a></li>
          <li><a routerLink="/" fragment="shop">Shop</a></li>
          <li><a routerLink="/" fragment="commissie">Commissie</a></li>
          <li><a routerLink="/" fragment="partners">Partners</a></li>
        </ul>

        <a routerLink="/activiteiten" class="navbar-cta">
          Bekijk programma
        </a>

        <button class="hamburger" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen()">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="mobile-menu" [class.open]="menuOpen()">
        <ul>
          <li><a routerLink="/" (click)="closeMenu()">Home</a></li>
          <li><a routerLink="/activiteiten" (click)="closeMenu()">Activiteiten</a></li>
          <li><a routerLink="/" fragment="media" (click)="closeMenu()">Media</a></li>
          <li><a routerLink="/" fragment="shop" (click)="closeMenu()">Shop</a></li>
          <li><a routerLink="/" fragment="commissie" (click)="closeMenu()">Commissie</a></li>
          <li><a routerLink="/" fragment="partners" (click)="closeMenu()">Partners</a></li>
          <li>
            <a routerLink="/activiteiten" class="mobile-cta" (click)="closeMenu()">Bekijk programma</a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 1.5rem 2rem;
      transition: background 0.3s ease, padding 0.3s ease;
    }

    .navbar.scrolled {
      background: rgba(29, 0, 44, 0.95);
      backdrop-filter: blur(12px);
      padding: 1rem 2rem;
    }

    .navbar-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .navbar-logo {
      flex-shrink: 0;
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 0.1em;
    }

    .navbar-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0 auto;
    }

    .navbar-links a {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }

    .navbar-links a:hover {
      color: var(--secondary);
    }

    .nav-link-active {
      color: var(--secondary) !important;
    }

    .navbar-cta {
      flex-shrink: 0;
      background: var(--primary);
      color: var(--on-primary);
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.625rem 1.5rem;
      border-radius: var(--radius-pill);
      transition: background 0.2s;
    }

    .navbar-cta:hover {
      background: var(--primary-dim);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;
    }

    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 2px;
      transition: transform 0.2s;
    }

    .mobile-menu {
      display: none;
      padding: 1.5rem 2rem;
    }

    .mobile-menu.open {
      display: block;
    }

    .mobile-menu ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .mobile-menu a {
      font-family: var(--font-body);
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .mobile-cta {
      display: inline-block;
      background: var(--primary);
      color: var(--on-primary) !important;
      padding: 0.75rem 2rem;
      border-radius: var(--radius-pill);
      font-weight: 700 !important;
    }

    @media (max-width: 768px) {
      .navbar-links, .navbar-cta { display: none; }
      .hamburger { display: flex; }
    }
  `]
})
export class Navbar implements OnInit, OnDestroy {
  scrolled = signal(false);
  menuOpen = signal(false);

  private readonly scrollHandler = () => this.scrolled.set(window.scrollY > 40);

  ngOnInit() {
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
