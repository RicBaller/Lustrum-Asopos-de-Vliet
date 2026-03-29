import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Beleef } from '../../components/beleef/beleef';
import { CtaStrip } from '../../components/cta-strip/cta-strip';
import { Hero } from '../../components/hero/hero';
import { KomendeChaos } from '../../components/komende-chaos/komende-chaos';
import { RevealSection } from '../../components/reveal-section/reveal-section';
import { ShopTeaser } from '../../components/shop-teaser/shop-teaser';

@Component({
  selector: 'app-home-page',
  imports: [Hero, RevealSection, ShopTeaser, KomendeChaos, Beleef, CtaStrip],
  template: `
    <app-hero />
    <app-reveal-section />
    <app-shop-teaser />
    <app-komende-chaos />
    <app-beleef />
    <app-cta-strip />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}