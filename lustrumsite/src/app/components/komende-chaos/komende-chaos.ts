import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { Activity } from '../../models/models';
import { ActivityService } from '../../services/activity.service';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
}

interface KomendEvent {
  id: number;
  dateLabel: string;
  detailLine: string;
  description: string;
  image: string | null;
  name: string;
  ticketLink: string | null;
}

@Component({
  selector: 'app-komende-chaos',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="kc-section">
      <div class="kc-inner">

        <header class="kc-header">
          <h2 class="kc-title">KOMENDE<br>EVENTS</h2>
          <p class="kc-subtitle">
            De drie eerstvolgende activiteiten van het lustrum, direct uit het programma.
          </p>
        </header>

        @if (loading()) {
          <div class="kc-empty">Activiteiten laden...</div>
        } @else if (events().length) {
          <div class="kc-events">
            @for (event of events(); track event.id; let i = $index) {
              <article class="kc-event" [class.kc-event--reverse]="i % 2 === 1">
                <div class="kc-img-wrap">
                  @if (event.image) {
                    <img [src]="event.image" [alt]="event.name" class="kc-img" loading="lazy" decoding="async" />
                  } @else {
                    <div class="kc-img-fallback">
                      <span>{{ event.dateLabel }}</span>
                      <strong>{{ event.name }}</strong>
                    </div>
                  }
                </div>

                <div class="kc-content">
                  <time class="kc-date">{{ event.dateLabel }}</time>
                  <h3 class="kc-name">{{ event.name }}</h3>
                  <p class="kc-meta">{{ event.detailLine }}</p>
                  <p class="kc-desc">{{ event.description }}</p>

                  <div class="kc-actions">
                    @if (event.ticketLink) {
                      <a class="kc-btn kc-btn--solid" [href]="event.ticketLink" target="_blank" rel="noreferrer">
                        Tickets
                      </a>
                    }

                    <a routerLink="/activiteiten" class="kc-btn">Meer info</a>
                  </div>
                </div>
              </article>
            }
          </div>

          @if (hasMore()) {
            <div class="kc-footer">
              <a routerLink="/activiteiten" class="kc-btn kc-btn--more">
                Bekijk alle activiteiten
              </a>
            </div>
          }
        } @else {
          <div class="kc-empty">Er staan nog geen komende activiteiten in het programma.</div>
        }

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
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 var(--spacing-gutter);
    }

    /* ── Header ── */
    .kc-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: end;
      gap: 3rem;
      margin-bottom: 5rem;
    }

    .kc-title {
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 9vw, 6.5rem);
      font-weight: 800;
      color: var(--surface);
      line-height: 0.95;
      letter-spacing: -0.02em;
      max-inline-size: 100%;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .kc-subtitle {
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.75;
      color: rgba(61, 21, 0, 0.82);
      align-self: end;
      padding-bottom: 0.25rem;
      max-width: 34rem;
    }

    /* ── Events ── */
    .kc-events {
      display: flex;
      flex-direction: column;
      gap: 5.5rem;
    }

    .kc-event {
      display: grid;
      grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
      gap: clamp(2rem, 4vw, 4rem);
      align-items: center;
    }

    .kc-img-wrap {
      width: min(100%, 320px);
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      overflow: hidden;
      justify-self: center;
      background: rgba(63, 0, 89, 0.18);
      box-shadow: 0 20px 45px rgba(61, 21, 0, 0.18);
    }

    .kc-event--reverse .kc-img-wrap {
      grid-column: 2;
      grid-row: 1;
    }

    .kc-event--reverse .kc-content {
      grid-column: 1;
      grid-row: 1;
    }

    .kc-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .kc-img-fallback {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      height: 100%;
      padding: 2rem;
      background:
        linear-gradient(180deg, rgba(0, 255, 255, 0.08), transparent 40%),
        linear-gradient(135deg, rgba(63, 0, 89, 0.18), rgba(63, 0, 89, 0.94));
      color: var(--text-primary);
    }

    .kc-img-fallback span {
      color: var(--secondary);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .kc-img-fallback strong {
      margin-top: auto;
      font-family: var(--font-display);
      font-size: 2rem;
      line-height: 0.95;
      text-transform: uppercase;
    }

    /* ── Content ── */
    .kc-content {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      min-width: 0;
      max-width: 35rem;
    }

    .kc-date {
      font-family: var(--font-body);
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.16em;
      color: rgba(61, 21, 0, 0.72);
      text-transform: uppercase;
    }

    .kc-name {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 3.1rem);
      font-weight: 800;
      color: var(--surface);
      letter-spacing: -0.02em;
      line-height: 1.05;
      text-transform: uppercase;
      max-inline-size: 100%;
      min-width: 0;
    }

    .kc-meta {
      font-family: var(--font-body);
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(61, 21, 0, 0.78);
    }

    .kc-desc {
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.65;
      color: rgba(61, 21, 0, 0.84);
      margin-top: 0.25rem;
    }

    .kc-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      margin-top: 0.6rem;
    }

    .kc-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.9rem;
      padding: 0.65rem 1.45rem;
      border: 1.5px solid var(--surface);
      background: transparent;
      border-radius: var(--radius-pill);
      color: var(--surface);
      font-family: var(--font-body);
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      align-self: flex-start;
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }

    .kc-btn--solid {
      background: var(--surface);
      color: var(--text-primary);
    }

    .kc-btn:hover {
      transform: translateY(-2px);
      background: var(--secondary);
      border-color: var(--secondary);
      color: var(--on-secondary);
    }

    .kc-empty {
      border-radius: 2rem;
      background: rgba(255, 255, 255, 0.16);
      color: var(--surface);
      padding: 2rem;
      font-size: 1rem;
      font-weight: 700;
      text-align: center;
    }

    .kc-footer {
      display: flex;
      justify-content: center;
      margin-top: 4rem;
    }

    .kc-btn--more {
      padding: 0.75rem 2rem;
      font-size: 0.8rem;
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
      .kc-header {
        grid-template-columns: 1fr;
        margin-bottom: 3.5rem;
      }

      .kc-title {
        font-size: clamp(2.2rem, 13vw, 3.2rem);
        line-height: 0.92;
        letter-spacing: -0.01em;
      }

      .kc-name {
        font-size: clamp(1.3rem, 9vw, 2rem);
        line-height: 1.02;
        display: block;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .kc-subtitle,
      .kc-content {
        max-width: 100%;
      }

      .kc-event,
      .kc-event--reverse {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .kc-event--reverse .kc-img-wrap,
      .kc-event--reverse .kc-content {
        grid-column: auto;
        grid-row: auto;
      }

      .kc-img-wrap {
        max-width: 220px;
      }
    }
  `],
})
export class KomendeChaos {
  private readonly activityService = inject(ActivityService);
  private readonly dayFormatter = new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
  });
  private readonly detailFormatter = new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  private readonly timeFormatter = new Intl.DateTimeFormat('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  private readonly activityState = toSignal(
    this.activityService.getAll().pipe(
      map((activities): ActivityState => ({
        activities,
        loading: false,
      })),
      startWith({
        activities: [],
        loading: true,
      } satisfies ActivityState),
      catchError(() =>
        of({
          activities: [],
          loading: false,
        } satisfies ActivityState)
      )
    ),
    {
      initialValue: {
        activities: [],
        loading: true,
      },
    }
  );

  readonly loading = computed(() => this.activityState().loading);

  private readonly upcomingActivities = computed<Activity[]>(() => {
    const now = Date.now();
    return this.activityState().activities
      .filter(a => {
        const start = this.parseDate(a.startDate);
        return this.isValidDate(start) && start.getTime() >= now;
      })
      .sort((a, b) => this.toTimestamp(a.startDate) - this.toTimestamp(b.startDate));
  });

  readonly hasMore = computed(() => this.upcomingActivities().length > 3);

  readonly events = computed<KomendEvent[]>(() => {
    return this.upcomingActivities().slice(0, 3).map((activity) => ({
      id: activity.id,
      dateLabel: this.createDateLabel(activity),
      detailLine: this.createDetailLine(activity),
      description: this.createExcerpt(activity.description),
      image: activity.image,
      name: activity.title,
      ticketLink: activity.ticketLink,
    }));
  });

  private createDateLabel(activity: Activity): string {
    const start = this.parseDate(activity.startDate);
    const end = this.parseDate(activity.endDate ?? activity.startDate);

    if (!this.isValidDate(start)) {
      return 'Datum volgt';
    }

    const startLabel = this.dayFormatter.format(start).replace('.', '').toUpperCase();

    if (!this.isValidDate(end) || this.isSameDay(start, end)) {
      return startLabel;
    }

    const endLabel = this.dayFormatter.format(end).replace('.', '').toUpperCase();
    return `${startLabel} - ${endLabel}`;
  }

  private createDetailLine(activity: Activity): string {
    const start = this.parseDate(activity.startDate);
    const end = this.parseDate(activity.endDate ?? activity.startDate);

    if (!this.isValidDate(start)) {
      return 'Tijd volgt';
    }

    const startTime = this.timeFormatter.format(start);
    const baseLabel = this.capitalize(this.detailFormatter.format(start));

    if (!this.isValidDate(end) || activity.endDate === activity.startDate) {
      return `${baseLabel} om ${startTime}`;
    }

    const endTime = this.timeFormatter.format(end);

    if (this.isSameDay(start, end)) {
      return `${baseLabel}, ${startTime} - ${endTime}`;
    }

    return `${baseLabel}, ${startTime} tot ${endTime}`;
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

    if (plainText.length <= 150) {
      return plainText;
    }

    return `${plainText.slice(0, 147).trimEnd()}...`;
  }

  private parseDate(value: string | null): Date {
    if (!value) {
      return new Date(Number.NaN);
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    return new Date(normalized);
  }

  private toTimestamp(value: string | null): number {
    const date = this.parseDate(value);
    return this.isValidDate(date) ? date.getTime() : Number.MAX_SAFE_INTEGER;
  }

  private isValidDate(date: Date): boolean {
    return !Number.isNaN(date.getTime());
  }

  private isSameDay(left: Date, right: Date): boolean {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  private capitalize(value: string): string {
    return value ? value[0].toUpperCase() + value.slice(1) : value;
  }
}
