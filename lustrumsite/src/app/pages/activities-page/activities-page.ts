import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, timeout } from 'rxjs';
import { Activity } from '../../models/models';
import { ActivityService } from '../../services/activity.service';

interface ActivityState {
  activities: Activity[];
  error: string | null;
  loading: boolean;
}

interface ActivityTimelineCard {
  activity: Activity;
  badge: string;
  dateLine: string;
  summary: string;
  timeLine: string;
}

interface ActivityDetailViewModel {
  activity: Activity;
  badge: string;
  dateLine: string;
  descriptionHtml: string;
  timeLine: string;
}

@Component({
  selector: 'app-activities-page',
  imports: [RouterLink],
  host: {
    '(document:keydown.escape)': 'closeDialog()',
  },
  template: `
    <section class="activities-hero">
      <div class="activities-hero__grain"></div>
      <div class="activities-hero__inner">
        <p class="activities-hero__eyebrow">Activiteiten</p>
        <h1 class="activities-hero__title">BELEEF DE<br>CHAOS</h1>
        <p class="activities-hero__subtitle">Het officiele programma van het lustrum Asopos de Vliet.</p>

        <div class="activities-hero__stats">
          <div class="hero-stat">
            <span>{{ timelineCards().length }}</span>
            <small>evenementen</small>
          </div>
          <div class="hero-stat hero-stat--wide">
            <span>{{ programRange() }}</span>
            <small>chronologisch op een tijdlijn</small>
          </div>
        </div>
      </div>

      <div class="activities-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C180,130 360,150 540,110 C720,70 900,10 1080,30 C1260,50 1350,100 1440,130 L1440,160 L0,160 Z" fill="#ff7a45"/>
        </svg>
      </div>
    </section>

    <section class="activities-timeline">
      <div class="activities-timeline__inner">
        @if (loading()) {
          <div class="timeline-loading" aria-live="polite">
            @for (item of skeletonItems; track item) {
              <div class="timeline-skeleton" [class.timeline-skeleton--reverse]="item % 2 === 0">
                <div class="timeline-skeleton__card"></div>
                <div class="timeline-skeleton__node"></div>
                <div class="timeline-skeleton__media"></div>
              </div>
            }
          </div>
        } @else if (error(); as message) {
          <div class="timeline-state timeline-state--error" aria-live="polite">
            <p>{{ message }}</p>
            <a routerLink="/" class="timeline-state__link">Terug naar home</a>
          </div>
        } @else if (!timelineCards().length) {
          <div class="timeline-state" aria-live="polite">
            <p>Er staan nog geen activiteiten in het programma.</p>
          </div>
        } @else {
          <div class="timeline">
            @for (card of timelineCards(); track card.activity.id; let index = $index) {
              <div class="timeline-row" [class.timeline-row--reverse]="index % 2 === 1">
                <article class="timeline-card">
                  <span class="timeline-card__badge">{{ card.badge }}</span>
                  <h2 class="timeline-card__title">{{ card.activity.title }}</h2>
                  <p class="timeline-card__date">{{ card.dateLine }}</p>
                  <p class="timeline-card__time">{{ card.timeLine }}</p>
                  <p class="timeline-card__summary">{{ card.summary }}</p>

                  <div class="timeline-card__actions">
                    @if (card.activity.ticketLink) {
                      <a
                        class="timeline-action"
                        [href]="card.activity.ticketLink"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tickets
                      </a>
                    }

                    <button type="button" class="timeline-action timeline-action--ghost" (click)="openDialog(card.activity)">
                      Meer info
                    </button>
                  </div>
                </article>

                <div class="timeline-node" aria-hidden="true">
                  <span>{{ index + 1 }}</span>
                </div>

                <button
                  type="button"
                  class="timeline-media"
                  (click)="openDialog(card.activity)"
                  [attr.aria-label]="'Open details voor ' + card.activity.title"
                >
                  @if (card.activity.image) {
                    <img [src]="card.activity.image" [alt]="card.activity.title">
                  } @else {
                    <div class="timeline-media__fallback">
                      <span>{{ card.badge }}</span>
                      <strong>{{ card.activity.title }}</strong>
                    </div>
                  }
                </button>
              </div>
            }
          </div>
        }
      </div>

      <div class="activities-timeline__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,110 C180,70 360,40 540,70 C720,100 900,150 1080,120 C1260,90 1350,40 1440,80 L1440,160 L0,160 Z" fill="#2b003d"/>
        </svg>
      </div>
    </section>

    <section class="activities-closing">
      <div class="activities-closing__inner">
        <h2 class="activities-closing__title">NIETS MISSEN?</h2>

        <div class="activities-closing__actions">
          @if (firstTicketLink(); as ticketLink) {
            <a class="closing-button closing-button--solid" [href]="ticketLink" target="_blank" rel="noreferrer">
              Bestel tickets
            </a>
          } @else {
            <button type="button" class="closing-button closing-button--solid closing-button--disabled" disabled>
              Tickets volgen snel
            </button>
          }

          <a routerLink="/" class="closing-button closing-button--outline">Meer over het lustrum</a>
        </div>
      </div>
    </section>

    @if (selectedDetail(); as selected) {
      <div class="activity-dialog-backdrop" (click)="closeDialog()">
        <section
          class="activity-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'activity-dialog-title-' + selected.activity.id"
          (click)="$event.stopPropagation()"
        >
          <button type="button" class="activity-dialog__close" (click)="closeDialog()" aria-label="Sluit popup">
            ×
          </button>

          <div class="activity-dialog__media">
            @if (selected.activity.image) {
              <img [src]="selected.activity.image" [alt]="selected.activity.title">
            } @else {
              <div class="activity-dialog__fallback">
                <span>{{ selected.badge }}</span>
                <strong>{{ selected.activity.title }}</strong>
              </div>
            }
          </div>

          <div class="activity-dialog__content">
            <span class="activity-dialog__badge">{{ selected.badge }}</span>
            <h2 [id]="'activity-dialog-title-' + selected.activity.id">{{ selected.activity.title }}</h2>
            <p class="activity-dialog__date">{{ selected.dateLine }}</p>
            <p class="activity-dialog__time">{{ selected.timeLine }}</p>

            <div class="activity-dialog__description" [innerHTML]="selected.descriptionHtml"></div>

            <div class="activity-dialog__actions">
              @if (selected.activity.ticketLink) {
                <a
                  class="timeline-action"
                  [href]="selected.activity.ticketLink"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bestel tickets
                </a>
              }

              <button type="button" class="timeline-action timeline-action--ghost" (click)="closeDialog()">
                Sluiten
              </button>
            </div>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .activities-hero {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1), transparent 28%),
        radial-gradient(circle at 80% 18%, rgba(240, 108, 48, 0.18), transparent 26%),
        var(--surface);
      padding: 8.5rem var(--spacing-gutter) 10rem;
    }

    .activities-hero__grain {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 22px 22px;
      opacity: 0.25;
      pointer-events: none;
    }

    .activities-hero__inner {
      position: relative;
      z-index: 1;
      max-width: 1120px;
      margin: 0 auto;
      text-align: center;
    }

    .activities-hero__eyebrow {
      color: var(--secondary);
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.22em;
      text-transform: uppercase;
    }

    .activities-hero__title {
      margin-top: 1.2rem;
      color: var(--primary);
      font-size: clamp(4rem, 13vw, 8.5rem);
      font-weight: 800;
      letter-spacing: -0.06em;
      line-height: 0.92;
      text-transform: uppercase;
    }

    .activities-hero__subtitle {
      max-width: 42rem;
      margin: 1.4rem auto 0;
      color: var(--secondary);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .activities-hero__stats {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 2.8rem;
    }

    .hero-stat {
      min-width: 11rem;
      border: 1px solid rgba(0, 255, 255, 0.25);
      border-radius: 1.5rem;
      background: rgba(255, 255, 255, 0.04);
      padding: 1rem 1.25rem;
      backdrop-filter: blur(14px);
    }

    .hero-stat--wide {
      min-width: 15rem;
    }

    .hero-stat span {
      display: block;
      color: var(--text-primary);
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .hero-stat small {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-muted);
      font-size: 0.8rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .activities-hero__wave,
    .activities-timeline__wave {
      position: absolute;
      right: 0;
      bottom: -1px;
      left: 0;
      line-height: 0;
    }

    .activities-hero__wave svg,
    .activities-timeline__wave svg {
      display: block;
      width: 100%;
      height: 160px;
    }

    .activities-timeline {
      position: relative;
      background: #ff7a45;
      padding: 10rem var(--spacing-gutter) 20rem;
    }

    .activities-timeline__inner {
      max-width: 1240px;
      margin: 0 auto;
    }

    .timeline,
    .timeline-loading {
      position: relative;
    }

    .timeline::before,
    .timeline-loading::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(50% - 1px);
      width: 2px;
      background: rgba(55, 0, 80, 0.28);
    }

    .timeline-row,
    .timeline-skeleton {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 92px minmax(0, 1fr);
      align-items: stretch;
      gap: 3rem;
    }

    .timeline-row + .timeline-row,
    .timeline-skeleton + .timeline-skeleton {
      margin-top: 10rem;
    }

    .timeline-row--reverse .timeline-card,
    .timeline-skeleton--reverse .timeline-skeleton__card {
      grid-column: 3;
      grid-row: 1;
    }

    .timeline-row--reverse .timeline-media,
    .timeline-skeleton--reverse .timeline-skeleton__media {
      grid-column: 1;
      grid-row: 1;
    }

    .timeline-card,
    .timeline-skeleton__card {
      grid-column: 1;
      grid-row: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      border-radius: 1.8rem;
      background: #2b003d;
      color: var(--text-primary);
      padding: 1.65rem 1.7rem 1.5rem;
      box-shadow: 0 18px 45px rgba(43, 0, 61, 0.16);
    }

    .timeline-card__badge {
      display: inline-flex;
      align-self: flex-start;
      align-items: center;
      width: auto;
      max-width: max-content;
      border-radius: 999px;
      background: rgba(0, 255, 255, 0.16);
      color: var(--secondary);
      padding: 0.28rem 0.65rem;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .timeline-card__title {
      margin-top: 0.95rem;
      color: var(--primary);
      font-size: clamp(1.7rem, 3vw, 2.35rem);
      line-height: 0.95;
      text-transform: uppercase;
    }

    .timeline-card__date,
    .timeline-card__time {
      color: rgba(255, 255, 255, 0.78);
      font-size: 0.92rem;
    }

    .timeline-card__date {
      margin-top: 1rem;
    }

    .timeline-card__time {
      color: var(--secondary);
      font-weight: 700;
    }

    .timeline-card__summary {
      margin-top: 0.95rem;
      color: #f5d9ff;
      font-size: 0.94rem;
      line-height: 1.65;
    }

    .timeline-card__actions,
    .activity-dialog__actions,
    .activities-closing__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
      margin-top: 1.35rem;
    }

    .timeline-card__actions {
      margin-top: auto;
      padding-top: 1.35rem;
    }

    .timeline-action,
    .closing-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3rem;
      border: 1px solid transparent;
      border-radius: 999px;
      padding: 0.8rem 1.4rem;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition:
        transform 180ms ease,
        background-color 180ms ease,
        color 180ms ease,
        border-color 180ms ease;
      cursor: pointer;
    }

    .timeline-action:hover,
    .closing-button:hover {
      transform: translateY(-2px);
    }

    .timeline-action,
    .closing-button--solid {
      background: var(--primary);
      color: var(--on-primary);
    }

    .timeline-action--ghost,
    .closing-button--outline {
      border-color: var(--secondary);
      background: transparent;
      color: var(--secondary);
    }

    .closing-button--disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    .closing-button--disabled:hover {
      transform: none;
    }

    .timeline-node,
    .timeline-skeleton__node {
      grid-column: 2;
      grid-row: 1;
      align-self: center;
      justify-self: center;
      position: relative;
      z-index: 1;
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      margin: 0 auto;
      border: 2px solid rgba(43, 0, 61, 0.24);
      border-radius: 50%;
      background: var(--secondary);
      color: #2b003d;
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 800;
      box-shadow: 0 0 0 10px rgba(255, 122, 69, 0.7);
    }

    .timeline-media,
    .timeline-skeleton__media {
      display: block;
      grid-column: 3;
      grid-row: 1;
      width: 100%;
      height: 100%;
      min-height: 17rem;
      border: 0;
      border-radius: 1.7rem;
      background: #1f002d;
      overflow: hidden;
      box-shadow: 0 18px 45px rgba(43, 0, 61, 0.14);
      cursor: pointer;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .timeline-media:hover {
      transform: translateY(-4px) rotate(-1deg);
      box-shadow: 0 24px 55px rgba(43, 0, 61, 0.22);
    }

    .timeline-media img,
    .activity-dialog__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(1) contrast(1.08);
    }

    .timeline-media__fallback,
    .activity-dialog__fallback {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      padding: 1.5rem;
      background:
        linear-gradient(180deg, rgba(0, 255, 255, 0.08), transparent 40%),
        linear-gradient(135deg, rgba(43, 0, 61, 0.2), rgba(43, 0, 61, 0.95));
      color: var(--text-primary);
      text-align: left;
    }

    .timeline-media__fallback span,
    .activity-dialog__fallback span {
      color: var(--secondary);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .timeline-media__fallback strong,
    .activity-dialog__fallback strong {
      margin-top: auto;
      color: var(--primary);
      font-family: var(--font-display);
      font-size: 1.6rem;
      line-height: 0.95;
      text-transform: uppercase;
    }

    .timeline-state {
      max-width: 34rem;
      margin: 0 auto;
      border-radius: 1.5rem;
      background: rgba(43, 0, 61, 0.14);
      color: #2b003d;
      padding: 1.6rem;
      text-align: center;
      box-shadow: inset 0 0 0 1px rgba(43, 0, 61, 0.08);
    }

    .timeline-state--error {
      background: rgba(43, 0, 61, 0.16);
      color: var(--text-primary);
    }

    .timeline-state__link {
      display: inline-flex;
      margin-top: 1rem;
      color: var(--secondary);
      font-weight: 700;
    }

    .timeline-skeleton__card,
    .timeline-skeleton__media {
      background:
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.22) 50%, rgba(255, 255, 255, 0.1) 100%),
        #2b003d;
      background-size: 220% 100%;
      animation: shimmer 1.6s infinite linear;
    }

    .timeline-skeleton__card {
      min-height: 17rem;
    }

    .timeline-skeleton__media {
      min-height: 17rem;
    }

    .activities-closing {
      background: #2b003d;
      padding: 4rem var(--spacing-gutter) 5.5rem;
    }

    .activities-closing__inner {
      max-width: 920px;
      margin: 0 auto;
      text-align: center;
    }

    .activities-closing__title {
      color: var(--secondary);
      font-size: clamp(2.8rem, 8vw, 5.4rem);
      text-transform: uppercase;
    }

    .activities-closing__actions {
      justify-content: center;
      margin-top: 2rem;
    }

    .activity-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: grid;
      place-items: center;
      background: rgba(16, 0, 24, 0.72);
      backdrop-filter: blur(18px);
      padding: 1.5rem;
    }

    .activity-dialog {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      width: min(100%, 980px);
      max-height: min(90vh, 760px);
      overflow: hidden;
      border: 1px solid rgba(0, 255, 255, 0.18);
      border-radius: 2rem;
      background: #2b003d;
      box-shadow: 0 35px 80px rgba(8, 0, 12, 0.45);
    }

    .activity-dialog__close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 2;
      width: 2.75rem;
      height: 2.75rem;
      border: 0;
      border-radius: 50%;
      background: rgba(43, 0, 61, 0.7);
      color: var(--text-primary);
      font-size: 1.8rem;
      line-height: 1;
      cursor: pointer;
    }

    .activity-dialog__media {
      min-height: 100%;
      background: #170021;
    }

    .activity-dialog__content {
      overflow: auto;
      padding: 2rem 2rem 2.2rem;
    }

    .activity-dialog__badge {
      display: inline-flex;
      border-radius: 999px;
      background: rgba(0, 255, 255, 0.14);
      color: var(--secondary);
      padding: 0.35rem 0.7rem;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .activity-dialog h2 {
      margin-top: 1rem;
      color: var(--primary);
      font-size: clamp(2rem, 4vw, 3.4rem);
      line-height: 0.95;
      text-transform: uppercase;
    }

    .activity-dialog__date,
    .activity-dialog__time {
      margin-top: 0.9rem;
      color: var(--text-secondary);
    }

    .activity-dialog__time {
      margin-top: 0.25rem;
      color: var(--secondary);
      font-weight: 700;
    }

    .activity-dialog__description {
      margin-top: 1.35rem;
      color: #f8e7ff;
      line-height: 1.7;
    }

    .activity-dialog__description :first-child {
      margin-top: 0;
    }

    .activity-dialog__description p + p {
      margin-top: 1rem;
    }

    @keyframes shimmer {
      from {
        background-position: 200% 0;
      }

      to {
        background-position: -20% 0;
      }
    }

    @media (max-width: 960px) {
      .activities-timeline {
        padding-top: 7rem;
        padding-bottom: 14rem;
      }

      .timeline::before,
      .timeline-loading::before {
        left: 22px;
      }

      .timeline-row,
      .timeline-skeleton {
        grid-template-columns: 46px minmax(0, 1fr);
        gap: 1.25rem 1.5rem;
      }

      .timeline-row + .timeline-row,
      .timeline-skeleton + .timeline-skeleton {
        margin-top: 7rem;
      }

      .timeline-card,
      .timeline-skeleton__card,
      .timeline-media,
      .timeline-skeleton__media,
      .timeline-row--reverse .timeline-card,
      .timeline-row--reverse .timeline-media,
      .timeline-skeleton--reverse .timeline-skeleton__card,
      .timeline-skeleton--reverse .timeline-skeleton__media {
        grid-column: 2;
      }

      .timeline-media,
      .timeline-skeleton__media {
        grid-row: auto;
        min-height: 14rem;
        height: auto;
      }

      .timeline-node,
      .timeline-skeleton__node {
        grid-column: 1;
        grid-row: 1;
        align-self: start;
      }

      .activity-dialog {
        grid-template-columns: 1fr;
      }

      .activity-dialog__media {
        min-height: 17rem;
      }
    }

    @media (max-width: 640px) {
      .activities-hero {
        padding-top: 7.5rem;
        padding-bottom: 8.5rem;
      }

      .activities-hero__subtitle {
        letter-spacing: 0.09em;
      }

      .timeline-card,
      .timeline-skeleton__card {
        padding: 1.35rem;
      }

      .activities-closing {
        padding-bottom: 4.5rem;
      }

      .activity-dialog__content {
        padding: 1.5rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesPage implements OnDestroy {
  readonly skeletonItems = [1, 2, 3, 4];
  readonly selectedActivity = signal<Activity | null>(null);

  private readonly document = inject(DOCUMENT);
  private readonly activityService = inject(ActivityService);
  private readonly shortMonthFormatter = new Intl.DateTimeFormat('nl-NL', { month: 'short' });
  private readonly fullDateFormatter = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  private readonly weekdayDateFormatter = new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  private readonly monthRangeFormatter = new Intl.DateTimeFormat('nl-NL', {
    month: 'long',
    year: 'numeric',
  });
  private readonly timeFormatter = new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  private readonly activityState = toSignal(
    this.activityService.getAll().pipe(
      timeout(10000),
      map(
        (activities): ActivityState => ({
          activities,
          error: null,
          loading: false,
        })
      ),
      startWith({
        activities: [],
        error: null,
        loading: true,
      } satisfies ActivityState),
      catchError(() =>
        of({
          activities: [],
          error: 'De activiteiten konden niet worden geladen.',
          loading: false,
        } satisfies ActivityState)
      )
    ),
    {
      initialValue: {
        activities: [],
        error: null,
        loading: true,
      },
    }
  );

  readonly loading = computed(() => this.activityState().loading);
  readonly error = computed(() => this.activityState().error);

  readonly activities = computed(() =>
    [...this.activityState().activities].sort(
      (left, right) => this.toTimestamp(left.startDate) - this.toTimestamp(right.startDate)
    )
  );

  readonly timelineCards = computed<ActivityTimelineCard[]>(() =>
    this.activities().map((activity) => ({
      activity,
      badge: this.createBadge(activity),
      dateLine: this.createDateLine(activity),
      summary: this.createExcerpt(activity.description),
      timeLine: this.createTimeLine(activity),
    }))
  );

  readonly selectedDetail = computed<ActivityDetailViewModel | null>(() => {
    const activity = this.selectedActivity();

    if (!activity) {
      return null;
    }

    return {
      activity,
      badge: this.createBadge(activity),
      dateLine: this.createDateLine(activity),
      descriptionHtml: this.createDescriptionHtml(activity.description),
      timeLine: this.createTimeLine(activity),
    };
  });

  readonly firstTicketLink = computed(
    () => this.activities().find((activity) => activity.ticketLink)?.ticketLink ?? null
  );

  readonly programRange = computed(() => {
    const activities = this.activities();

    if (!activities.length) {
      return 'programma in opbouw';
    }

    const firstActivity = activities[0];
    const lastActivity = activities[activities.length - 1];
    const firstDate = this.parseDate(firstActivity.startDate);
    const lastDate = this.parseDate(lastActivity.startDate);

    if (!this.isValidDate(firstDate) || !this.isValidDate(lastDate)) {
      return 'programma in tijdlijn';
    }

    return `${this.monthRangeFormatter.format(firstDate)} - ${this.monthRangeFormatter.format(lastDate)}`;
  });

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.selectedActivity() ? 'hidden' : '';
    });
  }

  ngOnDestroy() {
    this.document.body.style.overflow = '';
  }

  openDialog(activity: Activity) {
    this.selectedActivity.set(activity);
  }

  closeDialog() {
    this.selectedActivity.set(null);
  }

  private createBadge(activity: Activity): string {
    const start = this.parseDate(activity.startDate);
    const end = this.parseDate(activity.endDate || activity.startDate);

    if (!this.isValidDate(start)) {
      return 'datum volgt';
    }

    const startDay = start.getDate();
    const startMonth = this.formatShortMonth(start);

    if (!this.isValidDate(end) || this.isSameDay(start, end)) {
      return `${startDay} ${startMonth}`;
    }

    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${startDay}-${end.getDate()} ${startMonth}`;
    }

    return `${startDay} ${startMonth} - ${end.getDate()} ${this.formatShortMonth(end)}`;
  }

  private createDateLine(activity: Activity): string {
    const start = this.parseDate(activity.startDate);
    const end = this.parseDate(activity.endDate || activity.startDate);

    if (!this.isValidDate(start)) {
      return 'Datum wordt later bekendgemaakt';
    }

    if (!this.isValidDate(end) || this.isSameDay(start, end)) {
      return this.capitalize(this.weekdayDateFormatter.format(start));
    }

    return `${this.capitalize(this.weekdayDateFormatter.format(start))} t/m ${this.fullDateFormatter.format(end)}`;
  }

  private createExcerpt(description: string | null): string {
    const plainText = (description ?? '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!plainText) {
      return 'Meer details over deze activiteit volgen snel.';
    }

    if (plainText.length <= 180) {
      return plainText;
    }

    return `${plainText.slice(0, 177).trimEnd()}...`;
  }

  private createDescriptionHtml(description: string | null): string {
    if (!description?.trim()) {
      return '<p>Meer details over deze activiteit volgen snel.</p>';
    }

    return description;
  }

  private createTimeLine(activity: Activity): string {
    const start = this.parseDate(activity.startDate);
    const end = this.parseDate(activity.endDate || activity.startDate);

    if (!this.isValidDate(start)) {
      return 'Tijd wordt later bekendgemaakt';
    }

    const startTime = this.timeFormatter.format(start);

    if (!this.isValidDate(end) || activity.endDate === activity.startDate) {
      return `Aanvang om ${startTime}`;
    }

    const endTime = this.timeFormatter.format(end);

    if (this.isSameDay(start, end)) {
      return `${startTime} - ${endTime}`;
    }

    return `${startTime} tot ${endTime}`;
  }

  private formatShortMonth(date: Date): string {
    return this.shortMonthFormatter.format(date).replace('.', '').toUpperCase();
  }

  private isSameDay(left: Date, right: Date): boolean {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  private parseDate(value: string | null): Date {
    if (!value) {
      return new Date(Number.NaN);
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    return new Date(normalized);
  }

  private toTimestamp(value: string | null): number {
    const parsedDate = this.parseDate(value);
    return this.isValidDate(parsedDate) ? parsedDate.getTime() : Number.MAX_SAFE_INTEGER;
  }

  private isValidDate(value: Date): boolean {
    return !Number.isNaN(value.getTime());
  }

  private capitalize(value: string): string {
    if (!value.length) {
      return value;
    }

    return value[0].toUpperCase() + value.slice(1);
  }
}