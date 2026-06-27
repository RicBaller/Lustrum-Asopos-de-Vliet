import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { AlbumSummary } from '../../models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-beleef',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="beleef" id="archief">
      <!-- Top wave from programma -->
      <div class="beleef-wave-top">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 L0,40 C200,100 600,0 900,60 C1100,100 1300,20 1440,50 L1440,0 L0,0 Z" fill="var(--primary-fixed)"/>
        </svg>
      </div>

      <div class="beleef-inner">
        <header class="beleef-header">
          <div class="beleef-title-group">
            <h2 class="section-title">BELEEF HET TERUG</h2>
            <p class="beleef-sub">Blijf nog even delirisch. De drie meest recente fotoalbums van het lustrum.</p>
          </div>
        </header>

        <div class="memories-track">
          @if (albums() === undefined) {
            @for (i of [1, 2, 3]; track i) {
              <article class="memory-card memory-card--skeleton">
                <div class="memory-img">
                  <div class="memory-img-inner"></div>
                </div>
              </article>
            }
          } @else if (albums()!.length === 0) {
            <p class="beleef-empty">Nog geen albums beschikbaar.</p>
          } @else {
            @for (album of albums()!; track album.id) {
              <a class="memory-card" [routerLink]="['/albums', album.id]">
                <div class="memory-img">
                  <div class="memory-img-inner"
                       [class.memory-img-inner--has-cover]="album.coverPhotoUrl"
                       [style.background-image]="album.coverPhotoUrl ? 'url(' + album.coverPhotoUrl + ')' : null">
                    @if (!album.coverPhotoUrl) {
                      <div class="memory-placeholder-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span>Binnenkort beschikbaar</span>
                      </div>
                    }
                    <div class="memory-overlay">
                      <div class="memory-meta">
                        @if (album.coverPhotographer) {
                          <span class="memory-count">{{ album.coverPhotographer }}</span>
                        } @else {
                          <span class="memory-count">{{ album.photoCount }} FOTO'S</span>
                        }
                      </div>
                      <h3 class="memory-title">{{ album.title }}</h3>
                    </div>
                  </div>
                </div>
              </a>
            }
          }
        </div>
      </div>

      <!-- Bottom wave into lustrum-info (both dark) -->
      <div class="beleef-wave-bottom">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 C300,100 600,0 900,50 C1100,80 1300,20 1440,60 L1440,100 L0,100 Z" fill="var(--primary-fixed)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .beleef {
      position: relative;
      background: var(--surface);
      padding: calc(var(--spacing-section) + 80px) 0 calc(var(--spacing-section) + 60px);
      overflow: hidden;
    }

    .beleef-wave-top {
      position: absolute;
      top: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .beleef-wave-top svg {
      display: block;
      width: 100%;
      height: 120px;
    }

    .beleef-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--spacing-gutter);
    }

    .beleef-header {
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      margin-bottom: 3rem;
    }

    .section-title {
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 6vw, 5rem);
      font-weight: 700;
      color: var(--primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .beleef-sub {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--text-muted);
      margin-top: 0.75rem;
    }

    /* Memories track */
    .memories-track {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .memory-card {
      cursor: pointer;
      display: block;
      text-decoration: none;
      transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    /* Links - tilt links (naar buiten) */
    .memory-card:nth-child(3n+1):hover {
      transform: translateY(-8px) rotate(-2deg);
    }

    /* Midden - recht omhoog */
    .memory-card:nth-child(3n+2):hover {
      transform: translateY(-8px) rotate(0deg);
    }

    /* Rechts - tilt rechts (naar buiten) */
    .memory-card:nth-child(3n):hover {
      transform: translateY(-8px) rotate(2deg);
    }

    .memory-img {
      border-radius: var(--radius-xl);
      overflow: hidden;
      aspect-ratio: 3/4;
    }

    .memory-img-inner {
      width: 100%;
      height: 100%;
      background: var(--surface-highest);
      position: relative;
      transition: transform 0.4s ease;
    }

    .memory-card:hover .memory-img-inner {
      transform: scale(1.03);
    }

    .memory-card:nth-child(1) .memory-img-inner { background: linear-gradient(160deg, #2a003d 0%, #4b0069 60%, #6a0090 100%); }
    .memory-card:nth-child(2) .memory-img-inner { background: linear-gradient(160deg, #1e0030 0%, #3f0059 60%, #5c0080 100%); }
    .memory-card:nth-child(3) .memory-img-inner { background: linear-gradient(160deg, #320045 0%, #560075 60%, #7a00a8 100%); }

    .memory-img-inner--has-cover {
      background-size: cover !important;
      background-position: center !important;
    }

    .memory-placeholder-icon {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: rgba(255, 255, 255, 0.2);
    }

    .memory-placeholder-icon svg {
      width: 3rem;
      height: 3rem;
    }

    .memory-placeholder-icon span {
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.2);
    }

    .memory-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(29, 0, 44, 0.9) 0%, transparent 50%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.5rem;
    }

    .memory-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .memory-date,
    .memory-author,
    .memory-count {
      font-family: var(--font-body);
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .memory-sep {
      color: var(--surface-bright);
    }

    .memory-title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .beleef-wave-bottom {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .beleef-wave-bottom svg {
      display: block;
      width: 100%;
      height: 100px;
    }

    @media (max-width: 768px) {
      .memories-track {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .memories-track {
        grid-template-columns: 1fr;
      }
    }

    .beleef-empty {
      grid-column: 1 / -1;
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--text-muted);
      text-align: center;
      padding: 4rem 0;
    }

    .memory-card--skeleton .memory-img-inner {
      background: var(--surface-highest);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class Beleef {
  private readonly albumService = inject(AlbumService);

  readonly albums = toSignal(
    this.albumService.getAll().pipe(
      map(albums => albums.slice(-3)),
      catchError(() => of([] as AlbumSummary[])),
    ),
  );
}
