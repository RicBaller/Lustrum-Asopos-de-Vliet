import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrls: [`./hero.scss`],
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('deliriumContainer') deliriumContainer?: ElementRef<HTMLElement>;
  @ViewChild('blobContainer') blobContainer?: ElementRef<HTMLElement>;

  private mouseMoveListener?: () => void;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    if (this.deliriumContainer && this.blobContainer) {
      // Voer dit uit buiten Angular's zone
      this.ngZone.runOutsideAngular(() => {
        // Luister naar muisbewegingen in en rond de hele area
        this.mouseMoveListener = this.renderer.listen(
          this.deliriumContainer?.nativeElement,
          'mousemove',
          (event: MouseEvent) => {
            const rect = this.deliriumContainer!.nativeElement.getBoundingClientRect();
            this.createBlob(event.clientX - rect.left, event.clientY - rect.top);
          }
        );
      });
    }
  }

  ngOnDestroy() {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
    }
  }

  private createBlob(x: number, y: number) {
    if (!this.blobContainer) return;

    const blob = this.renderer.createElement('div');
    this.renderer.addClass(blob, 'delirious-stencil-blob');

    const size = 200;
    this.renderer.setStyle(blob, 'width', `${size}px`);
    this.renderer.setStyle(blob, 'height', `${size}px`);
    
    this.renderer.setStyle(blob, 'left', `${x}px`);
    this.renderer.setStyle(blob, 'top', `${y}px`);

    this.renderer.appendChild(this.blobContainer.nativeElement, blob);

    const containerRef = this.blobContainer.nativeElement;
    setTimeout(() => {
      this.renderer.removeChild(containerRef, blob);
    }, 1200);
  }
}
