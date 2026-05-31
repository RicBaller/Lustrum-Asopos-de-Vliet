import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Beleef } from '../../components/beleef/beleef';
import { CtaStrip } from '../../components/cta-strip/cta-strip';
import { Hero } from '../../components/hero/hero';
import { KomendeChaos } from '../../components/komende-chaos/komende-chaos';
import { LustrumInfo } from '../../components/lustrum-info/lustrum-info';
import { RevealSection } from '../../components/reveal-section/reveal-section';
import { ShopTeaser } from '../../components/shop-teaser/shop-teaser';

@Component({
  selector: 'app-home-page',
  imports: [Hero, RevealSection, ShopTeaser, KomendeChaos, Beleef, LustrumInfo, CtaStrip],
  template: `
    <app-hero />
    <app-lustrum-info />
    @defer (on idle) {
      <app-reveal-section />
      <app-komende-chaos />
      <app-beleef />
      <app-shop-teaser />
      <app-cta-strip />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}