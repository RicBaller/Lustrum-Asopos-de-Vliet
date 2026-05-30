import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { SeoRouteData } from './seo.types';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.applyCurrentRouteSeo();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.applyCurrentRouteSeo());
  }

  private applyCurrentRouteSeo(): void {
    const currentRoute = this.getDeepestChild(this.router.routerState.snapshot.root);
    const seo = currentRoute.data['seo'] as SeoRouteData | undefined;
    const routeTitle = currentRoute.title;
    const pageTitle = typeof routeTitle === 'string' ? routeTitle : 'Delirium | Lustrum Asopos de Vliet';

    const baseSiteUrl = (environment.siteUrl || this.document.location.origin).replace(/\/$/, '');
    const currentPath = this.router.url.split(/[?#]/)[0] || '/';
    const canonicalUrl = `${baseSiteUrl}${currentPath === '/' ? '' : currentPath}`;
    const description = seo?.description ?? 'Delirium XIII van Asopos de Vliet.';
    const image = seo?.image ? `${baseSiteUrl}${seo.image}` : `${baseSiteUrl}/favicon.ico`;
    const robots = seo?.noindex ? 'noindex, nofollow' : 'index, follow';
    const ogType = seo?.type ?? 'website';

    this.title.setTitle(pageTitle);
    this.updateCanonicalTag(canonicalUrl);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });

    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:locale', content: 'nl_NL' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Delirium XIII' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.updateJsonLd(seo?.schema ?? this.getDefaultSchema(canonicalUrl, pageTitle, description, image));
  }

  private getDeepestChild(route: import('@angular/router').ActivatedRouteSnapshot): import('@angular/router').ActivatedRouteSnapshot {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }

  private updateCanonicalTag(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private updateJsonLd(schema: Record<string, unknown> | Array<Record<string, unknown>>): void {
    const scriptId = 'app-seo-jsonld';
    let script = this.document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.text = JSON.stringify(schema);
  }

  private getDefaultSchema(
    canonicalUrl: string,
    title: string,
    description: string,
    image: string
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonicalUrl,
      image,
      inLanguage: 'nl-NL',
    };
  }
}
