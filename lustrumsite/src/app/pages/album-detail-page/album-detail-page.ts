import { ChangeDetectionStrategy, Component, computed, inject, signal, effect, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, map, of, startWith } from 'rxjs';
import { Album, Photo } from '../../models/models';
import { AlbumService } from '../../services/album.service';

interface AlbumState {
  album: Album | null;
  error: string | null;
  loading: boolean;
}

interface PhotographerGroup {
  photographerName: string;
  photos: Photo[];
}

@Component({
  selector: 'app-album-detail-page',
  imports: [RouterLink],
  templateUrl: './album-detail-page.html',
  styleUrls: ['./album-detail-page.css', './album-detail-page-gallery.css'],
  host: {
    '(document:keydown.escape)': 'closeLightbox()',
    '(document:keydown.arrowleft)': 'previousPhoto()',
    '(document:keydown.arrowright)': 'nextPhoto()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumDetailPage implements OnDestroy {
  readonly skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8];

  private readonly route = inject(ActivatedRoute);
  private readonly albumService = inject(AlbumService);
  private readonly document = inject(DOCUMENT);

  private readonly albumState = toSignal(
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.albumService.getById(id).pipe(
        map((album): AlbumState => ({ album, error: null, loading: false })),
        startWith({ album: null, error: null, loading: true } satisfies AlbumState),
        catchError(() => of({ album: null, error: 'Het album kon niet worden geladen.', loading: false } satisfies AlbumState))
      ))
    ),
    {
      initialValue: { album: null, error: null, loading: true }
    }
  );

  readonly loading = computed(() => this.albumState().loading);
  readonly error = computed(() => this.albumState().error);
  readonly album = computed(() => this.albumState().album);

  readonly groupedPhotos = computed<PhotographerGroup[]>(() => {
    const album = this.album();
    if (!album || !album.photos) return [];

    const groupMap = new Map<string, Photo[]>();
    for (const photo of album.photos) {
      const name = photo.photographer?.name || 'Overige foto\'s';
      if (!groupMap.has(name)) {
        groupMap.set(name, []);
      }
      groupMap.get(name)!.push(photo);
    }

    return Array.from(groupMap.entries())
      .map(([photographerName, photos]) => ({ photographerName, photos }))
      .sort((a, b) => {
        if (a.photographerName === 'Overige foto\'s') return 1;
        if (b.photographerName === 'Overige foto\'s') return -1;
        return a.photographerName.localeCompare(b.photographerName);
      });
  });

  // Lightbox state
  readonly isLightboxOpen = signal(false);
  readonly currentPhotoIndex = signal(0);
  readonly slideDirection = signal<'left' | 'right' | 'none'>('none');

  readonly allPhotos = computed(() => {
    const album = this.album();
    return album?.photos || [];
  });

  readonly currentPhoto = computed(() => {
    const photos = this.allPhotos();
    if (photos.length === 0) return null;
    return photos[this.currentPhotoIndex()];
  });

  readonly preloadPhotos = computed(() => {
    const photos = this.allPhotos();
    if (photos.length === 0) return [];
    
    const currentIndex = this.currentPhotoIndex();
    const len = photos.length;
    
    // We want the next 2 and previous 2
    const indicesToPreload = new Set<number>();
    indicesToPreload.add((currentIndex + 1) % len);
    indicesToPreload.add((currentIndex + 2) % len);
    indicesToPreload.add((currentIndex - 1 + len) % len);
    indicesToPreload.add((currentIndex - 2 + len) % len);
    
    // Convert indices to URLs
    return Array.from(indicesToPreload)
      .map(index => photos[index]?.url)
      .filter((url): url is string => !!url);
  });

  constructor() {
    effect(() => {
      this.document.body.style.overflow = this.isLightboxOpen() ? 'hidden' : '';
    });
  }

  ngOnDestroy() {
    this.document.body.style.overflow = '';
  }

  openLightbox(photo: Photo) {
    const index = this.allPhotos().findIndex(p => p.id === photo.id);
    if (index !== -1) {
      this.currentPhotoIndex.set(index);
      this.slideDirection.set('none');
      this.isLightboxOpen.set(true);
    }
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
  }

  nextPhoto() {
    if (!this.isLightboxOpen()) return;
    
    const photos = this.allPhotos();
    if (photos.length === 0) return;
    
    this.currentPhotoIndex.update(index => (index + 1) % photos.length);
    
    this.slideDirection.set('none');
    setTimeout(() => this.slideDirection.set('left'), 10);
  }

  previousPhoto() {
    if (!this.isLightboxOpen()) return;
    
    const photos = this.allPhotos();
    if (photos.length === 0) return;
    
    this.currentPhotoIndex.update(index => (index - 1 + photos.length) % photos.length);
    
    this.slideDirection.set('none');
    setTimeout(() => this.slideDirection.set('right'), 10);
  }
}
