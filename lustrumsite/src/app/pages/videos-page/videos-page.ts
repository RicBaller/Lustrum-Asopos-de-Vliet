import { ChangeDetectionStrategy, Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Video, VideoCategory } from '../../models/models';
import { VideoService } from '../../services/video.service';
import { SafePipe } from '../../pipes/safe.pipe';

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
  return match ? match[1] : null;
}

export interface VideoGroup {
  category: VideoCategory | null;
  label: string;
  videos: Video[];
  cols: 2 | 3;
}

interface VideosState {
  videos: Video[];
  error: string | null;
  loading: boolean;
}

@Component({
  selector: 'app-videos-page',
  imports: [RouterLink, SafePipe],
  templateUrl: './videos-page.html',
  styleUrls: ['./videos-page.css'],
  host: {
    '(document:keydown.escape)': 'closeLightbox()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosPage implements OnDestroy {
  private readonly videoService = inject(VideoService);
  private readonly document = inject(DOCUMENT);

  readonly skeletonCount = [1, 2, 3, 4];

  private readonly videosState = toSignal(
    this.videoService.getAll().pipe(
      map((videos): VideosState => ({ videos, error: null, loading: false })),
      startWith({ videos: [], error: null, loading: true } satisfies VideosState),
      catchError(() =>
        of({ videos: [], error: "De video's konden niet worden geladen.", loading: false } satisfies VideosState)
      )
    ),
    { initialValue: { videos: [], error: null, loading: true } satisfies VideosState }
  );

  readonly loading = computed(() => this.videosState().loading);
  readonly error = computed(() => this.videosState().error);

  readonly groupedVideos = computed<VideoGroup[]>(() => {
    const { videos } = this.videosState();
    if (!videos.length) return [];

    const groupMap = new Map<string, { category: VideoCategory | null; videos: Video[] }>();

    for (const video of videos) {
      const key = video.category ? String(video.category.id) : 'uncategorized';
      if (!groupMap.has(key)) {
        groupMap.set(key, { category: video.category, videos: [] });
      }
      groupMap.get(key)!.videos.push(video);
    }

    return Array.from(groupMap.values()).map(group => {
      const count = group.videos.length;
      const cols: 2 | 3 = count % 3 === 0 ? 3 : 2;
      return {
        category: group.category,
        label: group.category?.title ?? 'Overig',
        videos: group.videos,
        cols,
      };
    }).sort((a, b) => {
      const sa = a.category?.sortOrder ?? 9999;
      const sb = b.category?.sortOrder ?? 9999;
      return sa - sb;
    });
  });

  private readonly WAVE_SHAPES = [
    'M0,60 C360,140 720,0 1080,80 C1260,120 1380,30 1440,60 L1440,160 L0,160 Z',
    'M0,120 C240,20 480,160 720,60 C960,-20 1200,140 1440,80 L1440,160 L0,160 Z',
    'M0,80 C180,160 420,0 660,110 C900,220 1140,10 1440,80 L1440,160 L0,160 Z',
    'M0,40 C240,150 480,10 720,100 C960,190 1200,20 1440,80 L1440,160 L0,160 Z',
    'M0,100 C300,0 540,180 840,60 C1080,-20 1300,140 1440,100 L1440,160 L0,160 Z',
  ];

  private readonly ORANGE = '#F06C30';
  private readonly PURPLE = '#3f0059';

  closingIsOrange = computed(() => {
    const count = this.groupedVideos().length;
    // Last category index = count-1. The closing section is next: index = count.
    // isOrangeSection(count) = count % 2 === 0
    return count % 2 === 0;
  });

  isOrangeSection(index: number): boolean {
    return index % 2 === 0;
  }

  bottomWaveFill(index: number, isLast: boolean): string {
    if (isLast) {
      // Fill with the closing section's background color
      const closingOrange = this.closingIsOrange();
      return closingOrange ? this.ORANGE : this.PURPLE;
    }
    return index % 2 === 0 ? this.PURPLE : this.ORANGE;
  }

  bottomWavePath(index: number): string {
    return this.WAVE_SHAPES[index % this.WAVE_SHAPES.length];
  }

  readonly selectedVideo = signal<Video | null>(null);
  readonly isLightboxOpen = signal(false);

  openLightbox(video: Video): void {
    this.selectedVideo.set(video);
    this.isLightboxOpen.set(true);
    this.document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen.set(false);
    this.selectedVideo.set(null);
    this.document.body.style.overflow = '';
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = '';
  }

  getEmbedUrl(youtubeUrl: string): string {
    const id = getYoutubeId(youtubeUrl);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : '';
  }

  getThumbnailUrl(youtubeUrl: string): string {
    const id = getYoutubeId(youtubeUrl);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }
}
