import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../../services/video.service';

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
  return match ? match[1] : null;
}

function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function getYoutubeWatchUrl(url: string): string {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
}

@Component({
  selector: 'app-reveal-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="reveal-section" id="media">
      <div class="reveal-inner">
        <header class="reveal-header">
          <div class="reveal-big-text">
            <span>DELERIUM</span>
            <span class="reveal-year">XIII</span>
          </div>
          <p class="reveal-sub">De bekendmakingen van het organisme.</p>
        </header>

        <div class="video-cards">
          @for (video of bekendmakingen(); track video.id) {
            <a class="video-card" [href]="getWatchUrl(video.youtubeURL)" target="_blank" rel="noopener noreferrer">
              <div class="video-card-thumb">
                @if (getThumbnail(video.youtubeURL); as thumb) {
                  <img [src]="thumb" [alt]="video.title" class="video-thumb-img" />
                }
                <div class="play-btn" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <p class="video-card-label">{{ video.title }}</p>
              @if (video.credits) {
                <p class="video-card-credits">{{ video.credits }}</p>
              }
            </a>
          } @empty {
            <div class="video-card">
              <div class="video-card-thumb">
                <div class="coming-soon-badge">BINNENKORT</div>
              </div>
              <p class="video-card-label">KLEUREN REVEAL</p>
            </div>
            <div class="video-card">
              <div class="video-card-thumb">
                <div class="coming-soon-badge">BINNENKORT</div>
              </div>
              <p class="video-card-label">LUSTRUM BEKENDMAKING</p>
            </div>
          }
        </div>
      </div>

      <!-- Bottom wave back to surface -->
      <div class="reveal-wave-bottom">
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C360,140 720,0 1080,80 C1260,120 1380,40 1440,60 L1440,140 L0,140 Z" fill="var(--surface)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .reveal-section {
      position: relative;
      background: var(--primary-fixed);
      padding: var(--spacing-section) var(--spacing-gutter);
      overflow: hidden;
    }

    .reveal-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    .reveal-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 2rem;
    }

    .reveal-sub {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--on-primary);
      padding-bottom: 0.5rem;
    }

    /* Videos */
    .video-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .video-card {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      cursor: pointer;
    }

    .video-card-thumb {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      background: var(--surface-highest);
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }

    .video-card:hover .video-card-thumb {
      transform: scale(1.02);
    }

    .video-card-thumb::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #580079 0%, #3f0059 100%);
    }

    .video-thumb-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .play-btn {
      position: relative;
      z-index: 1;
      width: 56px;
      height: 56px;
      border-radius: var(--radius-pill);
      background: rgba(240, 108, 48, 0.9);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background 0.2s;
      backdrop-filter: blur(4px);
    }

    .video-card:hover .play-btn {
      transform: scale(1.1);
      background: var(--primary);
    }

    .video-card-credits {
      font-family: var(--font-body);
      font-size: 0.75rem;
      color: var(--on-primary);
      opacity: 0.7;
      margin-top: -0.5rem;
    }

    .coming-soon-badge {
      position: relative;
      z-index: 1;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(0, 251, 251, 0.35);
      color: var(--secondary);
      font-family: var(--font-body);
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-pill);
    }

    .video-card-label {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--surface);
      letter-spacing: 0.02em;
    }

    .reveal-big-text {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .reveal-big-text span {
      font-family: var(--font-display);
      font-size: clamp(3rem, 7vw, 6rem);
      font-weight: 700;
      color: var(--surface);
      letter-spacing: -0.04em;
      line-height: 0.9;
    }

    .reveal-year {
      color: var(--surface-highest) !important;
    }

    .reveal-wave-bottom {
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .reveal-wave-bottom svg {
      display: block;
      width: 100%;
      height: 140px;
    }

    @media (max-width: 768px) {
      .video-cards {
        grid-template-columns: 1fr;
      }
      .reveal-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class RevealSection {
  private readonly videoService = inject(VideoService);

  private readonly allVideos = toSignal(this.videoService.getAll(), { initialValue: [] });

  readonly bekendmakingen = computed(() =>
    this.allVideos().filter(v => v.category?.title === 'Bekendmaking')
  );

  readonly getThumbnail = getYoutubeThumbnail;
  readonly getWatchUrl = getYoutubeWatchUrl;
}
