import { Directive, inject, input } from '@angular/core';
import { Route, Router, RouterLink, UrlTree } from '@angular/router';

type PrefetchTarget = string | readonly (string | number)[] | UrlTree | null | undefined;

@Directive({
  selector: '[appPrefetchOnInteraction]',
  standalone: true,
  host: {
    '(mouseenter)': 'triggerPrefetch()',
    '(focus)': 'triggerPrefetch()',
    '(touchstart)': 'triggerPrefetch()',
  },
})
export class PrefetchOnInteractionDirective {
  private static readonly prefetchedPaths = new Set<string>();

  readonly prefetchPath = input<PrefetchTarget>(undefined, {
    alias: 'appPrefetchOnInteraction',
  });

  private readonly router = inject(Router);
  private readonly routerLink = inject(RouterLink, { optional: true, self: true });
  private hasTriggered = false;

  triggerPrefetch(): void {
    if (this.hasTriggered) {
      return;
    }
    this.hasTriggered = true;

    const target = this.prefetchPath() ?? this.routerLink?.routerLink;
    const normalizedPath = this.normalizePath(target);

    if (normalizedPath === null || PrefetchOnInteractionDirective.prefetchedPaths.has(normalizedPath)) {
      return;
    }

    const route = this.findRouteToPrefetch(normalizedPath);
    if (!route?.loadComponent) {
      return;
    }

    PrefetchOnInteractionDirective.prefetchedPaths.add(normalizedPath);

    void Promise.resolve(route.loadComponent()).catch(() => {
        PrefetchOnInteractionDirective.prefetchedPaths.delete(normalizedPath);
      });
  }

  private findRouteToPrefetch(path: string): Route | undefined {
    const firstSegment = path.split('/')[0] ?? '';

    return this.router.config.find((route) => {
      if (!route.path || route.path === '**') {
        return false;
      }

      if (route.path === firstSegment) {
        return true;
      }

      return route.path.startsWith(`${firstSegment}/:`);
    });
  }

  private normalizePath(target: PrefetchTarget): string | null {
    if (target == null) {
      return null;
    }

    if (target instanceof UrlTree) {
      return this.normalizePath(this.router.serializeUrl(target));
    }

    if (typeof target === 'string') {
      if (target.startsWith('http://') || target.startsWith('https://')) {
        return null;
      }

      const cleaned = target.split('?')[0]?.split('#')[0]?.replace(/^\/+|\/+$/g, '') ?? '';
      return cleaned;
    }

    const cleaned = target
      .filter((segment): segment is string | number => typeof segment === 'string' || typeof segment === 'number')
      .map((segment) => String(segment).replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');

    return cleaned;
  }
}
