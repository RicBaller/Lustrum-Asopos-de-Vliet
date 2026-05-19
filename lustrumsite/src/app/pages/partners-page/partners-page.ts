import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, timeout } from 'rxjs';
import { Sponsor } from '../../models/models';
import { SponsorService } from '../../services/sponsor.service';

interface PartnersState {
  sponsors: Sponsor[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-partners-page',
  host: {
    '(document:keydown.escape)': 'closeDialog()',
  },
  imports: [],
  templateUrl: './partners-page.html',
  styleUrls: [
    './partners-page.css',
    './partners-page-hero.css',
    './partners-page-grid.css',
    './partners-page-dialog.css',
    './partners-page-responsive.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnersPage implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly sponsorService = inject(SponsorService);

  readonly selectedSponsor = signal<Sponsor | null>(null);
  readonly isClosingDialog = signal(false);

  private dialogCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly state = toSignal(
    this.sponsorService.getSponsors().pipe(
      timeout(10_000),
      map((sponsors): PartnersState => ({
        sponsors,
        loading: false,
        error: null,
      })),
      catchError(() =>
        of({
          sponsors: [],
          loading: false,
          error: 'De partners konden niet worden geladen.',
        } satisfies PartnersState)
      ),
      startWith({
        sponsors: [],
        loading: true,
        error: null,
      } satisfies PartnersState)
    ),
    {
      initialValue: {
        sponsors: [],
        loading: true,
        error: null,
      } satisfies PartnersState,
    }
  );

  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly sponsors = computed(() => this.state().sponsors.filter(s => !s.isMainSponsor));
  readonly mainSponsors = computed(() => this.state().sponsors.filter(s => s.isMainSponsor));
  readonly sponsorCount = computed(() => this.state().sponsors.length);

  openDialog(sponsor: Sponsor): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
      this.dialogCloseTimeout = null;
    }
    this.isClosingDialog.set(false);
    this.selectedSponsor.set(sponsor);
    this.document.body.style.overflow = 'hidden';
  }

  closeDialog(): void {
    if (this.isClosingDialog() || !this.selectedSponsor()) return;
    this.isClosingDialog.set(true);
    this.dialogCloseTimeout = setTimeout(() => {
      this.dialogCloseTimeout = null;
      this.selectedSponsor.set(null);
      this.isClosingDialog.set(false);
      this.document.body.style.overflow = '';
    }, 350);
  }

  openExternalUrl(url: string, event: MouseEvent): void {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  ngOnDestroy(): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
    }
    this.document.body.style.overflow = '';
  }
}
