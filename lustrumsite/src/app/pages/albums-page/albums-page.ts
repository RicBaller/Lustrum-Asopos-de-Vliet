import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { AlbumSummary } from '../../models/models';
import { AlbumService } from '../../services/album.service';

interface AlbumsState {
  albums: AlbumSummary[];
  error: string | null;
  loading: boolean;
}

@Component({
  selector: 'app-albums-page',
  imports: [RouterLink],
  templateUrl: './albums-page.html',
  styleUrls: ['./albums-page.css', './albums-page-grid.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumsPage {
  readonly skeletonItems = [1, 2, 3, 4];

  private readonly albumService = inject(AlbumService);

  private readonly albumsState = toSignal(
    this.albumService.getAll().pipe(
      map((albums): AlbumsState => ({ albums, error: null, loading: false })),
      startWith({ albums: [], error: null, loading: true } satisfies AlbumsState),
      catchError(() => of({ albums: [], error: 'De albums konden niet worden geladen.', loading: false } satisfies AlbumsState))
    ),
    {
      initialValue: { albums: [], error: null, loading: true }
    }
  );

  readonly loading = computed(() => this.albumsState().loading);
  readonly error = computed(() => this.albumsState().error);
  readonly albums = computed(() => this.albumsState().albums);
}
