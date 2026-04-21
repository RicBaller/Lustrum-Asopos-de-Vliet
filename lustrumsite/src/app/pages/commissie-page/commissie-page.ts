import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, startWith, timeout } from 'rxjs';
import { CommissieLid, SubCommissie } from '../../models/models';
import { CommissieService } from '../../services/commissie.service';

interface CommissieState {
  leden: CommissieLid[];
  subcommissies: SubCommissie[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-commissie-page',
  host: {
    '(document:keydown.escape)': 'closeDialog()',
  },
  templateUrl: './commissie-page.html',
  styleUrls: [
    './commissie-page.css',
    './commissie-page-hero.css',
    './commissie-page-leden.css',
    './commissie-page-sub.css',
    './commissie-page-dialog.css',
    './commissie-page-responsive.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissiePage implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly commissieService = inject(CommissieService);

  readonly selectedSub = signal<SubCommissie | null>(null);
  readonly isClosingDialog = signal(false);
  readonly expandedSubId = signal<number | null>(null);
  readonly isCollapsingSubId = signal<number | null>(null);

  private dialogCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly state = toSignal(
    forkJoin({
      leden: this.commissieService.getLustrumCommissie(),
      subcommissies: this.commissieService.getSubcommissies(),
    }).pipe(
      timeout(10_000),
      map((data): CommissieState => ({
        leden: data.leden,
        subcommissies: data.subcommissies,
        loading: false,
        error: null,
      })),
      catchError(() =>
        of({
          leden: [],
          subcommissies: [],
          loading: false,
          error: 'De commissie kon niet worden geladen.',
        } satisfies CommissieState)
      ),
      startWith({
        leden: [],
        subcommissies: [],
        loading: true,
        error: null,
      } satisfies CommissieState)
    ),
    {
      initialValue: {
        leden: [],
        subcommissies: [],
        loading: true,
        error: null,
      } satisfies CommissieState,
    }
  );

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly leden = computed(() => this.state().leden);
  readonly subcommissies = computed(() => this.state().subcommissies);
  readonly ledenCount = computed(() => this.state().leden.length);
  readonly subCount = computed(() => this.state().subcommissies.length);

  openDialog(sub: SubCommissie): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
      this.dialogCloseTimeout = null;
    }
    this.isClosingDialog.set(false);
    this.isCollapsingSubId.set(null);
    this.selectedSub.set(sub);
    this.expandedSubId.set(sub.id);
    this.document.body.style.overflow = 'hidden';
  }

  closeDialog(): void {
    if (this.isClosingDialog() || !this.selectedSub()) return;
    this.isClosingDialog.set(true);
    this.isCollapsingSubId.set(this.selectedSub()!.id);
    this.dialogCloseTimeout = setTimeout(() => {
      this.dialogCloseTimeout = null;
      this.selectedSub.set(null);
      this.expandedSubId.set(null);
      this.isClosingDialog.set(false);
      this.isCollapsingSubId.set(null);
      this.document.body.style.overflow = '';
    }, 400);
  }

  ngOnDestroy(): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
    }
    this.document.body.style.overflow = '';
  }
}
