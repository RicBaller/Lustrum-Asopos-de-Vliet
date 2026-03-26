import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { RevealSection } from './components/reveal-section/reveal-section';
import { Programma } from './components/programma/programma';
import { Beleef } from './components/beleef/beleef';
import { CtaStrip } from './components/cta-strip/cta-strip';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, RevealSection, Programma, Beleef, CtaStrip, Footer],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-reveal-section />
      <app-programma />
      <app-beleef />
      <app-cta-strip />
    </main>
    <app-footer />
  `,
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
