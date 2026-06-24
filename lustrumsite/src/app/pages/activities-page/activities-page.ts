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
  monthNumber: string;
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
  templateUrl: './activities-page.html',
  styleUrls: [
    './activities-page.css',
    './activities-page-hero.css',
    './activities-page-timeline-layout.css',
    './activities-page-timeline-cards.css',
    './activities-page-closing.css',
    './activities-page-dialog.css',
    './activities-page-responsive.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesPage implements OnDestroy {
  readonly skeletonItems = [1, 2, 3, 4];
  readonly selectedActivity = signal<Activity | null>(null);

  readonly isClosingDialog = signal(false);

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
      monthNumber: this.createMonthNumber(activity),
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
    if (this.isClosingDialog() || !this.selectedActivity()) return;
    
    this.isClosingDialog.set(true);
    setTimeout(() => {
      this.selectedActivity.set(null);
      this.isClosingDialog.set(false);
    }, 300); // Wait for the 300ms closing animation
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

  private createMonthNumber(activity: Activity): string {
    const date = this.parseDate(activity.startDate);
    return this.isValidDate(date) ? String(date.getMonth() + 1) : '?';
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