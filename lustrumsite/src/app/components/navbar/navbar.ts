import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PrefetchOnInteractionDirective } from '../../directives/prefetch-on-interaction.directive';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, PrefetchOnInteractionDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.scrolled]': 'scrolled()' },
  template: `
    <nav class="navbar" [class.scrolled]="scrolled()" [class.menu-open]="menuOpen()">
      <div class="navbar-inner">
        <a routerLink="/" class="navbar-logo" aria-label="Ga naar home">
          <img ngSrc="/logo-wit-128.webp" width="64" height="64" alt="Delirium" class="logo-img" priority decoding="async" />
        </a>

        <ul class="navbar-links">
          <li>
            <a appPrefetchOnInteraction routerLink="/" routerLinkActive="nav-link-active" [routerLinkActiveOptions]="{ exact: true }">
              Home
            </a>
          </li>
          <li>
            <a appPrefetchOnInteraction routerLink="/activiteiten" routerLinkActive="nav-link-active">Activiteiten</a>
          </li>
          <li><a appPrefetchOnInteraction routerLink="/shop" routerLinkActive="nav-link-active">Shop</a></li>
          <li class="has-dropdown" routerLinkActive="nav-dropdown-active">
            <a style="cursor: pointer;">
              Media
              <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </a>
            <div class="dropdown-menu">
              <a appPrefetchOnInteraction routerLink="/albums" routerLinkActive="nav-link-active">Foto's</a>
              <a appPrefetchOnInteraction routerLink="/videos" routerLinkActive="nav-link-active">Video's</a>
            </div>
          </li>
          <li><a appPrefetchOnInteraction routerLink="/commissie" routerLinkActive="nav-link-active">Commissie</a></li>
          <li><a appPrefetchOnInteraction routerLink="/partners" routerLinkActive="nav-link-active">Partners</a></li>
        </ul>

        <a appPrefetchOnInteraction routerLink="/activiteiten" class="navbar-cta">
          Bekijk programma
        </a>

        <button
          type="button"
          class="hamburger"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          [attr.aria-label]="menuOpen() ? 'Sluit menu' : 'Open menu'"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <div class="mobile-menu" [class.open]="menuOpen()">
        <ul>
          <li><a appPrefetchOnInteraction routerLink="/" (click)="closeMenu()">Home</a></li>
          <li><a appPrefetchOnInteraction routerLink="/activiteiten" (click)="closeMenu()">Activiteiten</a></li>
          <li class="mobile-has-dropdown">
            <button class="mobile-dropdown-toggle" (click)="mediaDropdownOpen.set(!mediaDropdownOpen())">
              Media
              <svg [style.transform]="mediaDropdownOpen() ? 'rotate(180deg)' : 'rotate(0deg)'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.2s"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="mobile-dropdown-menu" [class.open]="mediaDropdownOpen()">
              <a appPrefetchOnInteraction routerLink="/albums" (click)="closeMenu()">Foto's</a>
              <a appPrefetchOnInteraction routerLink="/videos" (click)="closeMenu()">Video's</a>
            </div>
          </li>
          <li><a appPrefetchOnInteraction routerLink="/shop" (click)="closeMenu()">Shop</a></li>
          <li><a appPrefetchOnInteraction routerLink="/commissie" (click)="closeMenu()">Commissie</a></li>
          <li><a appPrefetchOnInteraction routerLink="/partners" (click)="closeMenu()">Partners</a></li>
          <li>
            <a appPrefetchOnInteraction routerLink="/activiteiten" class="mobile-cta" (click)="closeMenu()">Bekijk programma</a>
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

    .navbar.scrolled,
    .navbar.menu-open {
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
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 0.25rem;
      background: transparent;
      transition: background 0.3s ease;
    }

    .navbar.scrolled .navbar-logo,
    .navbar.menu-open .navbar-logo {
      background: transparent;
    }

    .logo-text {
      font-family: var(--font-hero);
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--primary);
      letter-spacing: 0.1em;
    }

    .logo-img {
      height: 4rem;
      width: auto;
      display: block;
    }

    .navbar-links {
      display: flex;
      align-items: center;
      list-style: none;
      gap: 2rem;
      margin: 0 auto;
    }

    .navbar-links a {
      display: flex;
      align-items: center;
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
      text-decoration: none;
    }

    .navbar-links a:hover {
      color: var(--secondary);
    }

    .nav-link-active,
    .nav-dropdown-active > a {
      color: var(--secondary) !important;
    }

    .has-dropdown {
      position: relative;
    }

    .has-dropdown > a {
      gap: 0.25rem;
    }

    .dropdown-icon {
      transition: transform 0.2s ease;
    }

    .has-dropdown:hover .dropdown-icon {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: var(--surface-high);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 160px;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: all 0.2s ease;
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
    }

    .has-dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
      pointer-events: auto;
    }

    .dropdown-menu a {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      display: block;
      text-align: center;
    }

    .dropdown-menu a:hover {
      background: rgba(255, 255, 255, 0.05);
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
      text-decoration: none;
    }

    .mobile-dropdown-toggle {
      background: none;
      border: none;
      font-family: var(--font-body);
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0;
      width: 100%;
      text-align: left;
      text-transform: none;
    }

    .mobile-dropdown-menu {
      display: none;
      flex-direction: column;
      gap: 1rem;
      padding-top: 1rem;
      padding-left: 1rem;
      border-left: 2px solid rgba(255, 255, 255, 0.1);
      margin-left: 0.5rem;
      margin-top: 0.5rem;
    }

    .mobile-dropdown-menu.open {
      display: flex;
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
  mediaDropdownOpen = signal(false);

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
    this.mediaDropdownOpen.set(false);
  }
}
