import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrefetchOnInteractionDirective } from '../../directives/prefetch-on-interaction.directive';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrls: [`./hero.scss`],
  imports: [RouterLink, PrefetchOnInteractionDirective],
})
export class Hero implements AfterViewInit {
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const root = this.el.nativeElement as HTMLElement;
    const video = root.querySelector('.hero-background-video') as HTMLVideoElement | null;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const playPromise = video.play();
    if (playPromise) {
      void playPromise.catch(() => {
        // Ignore autoplay rejections. User interaction can still start playback.
      });
    }
  }
}
