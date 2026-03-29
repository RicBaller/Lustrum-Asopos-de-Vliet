import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Preloader } from './components/preloader/preloader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Preloader],
  template: `
    <app-preloader />
    <app-navbar />
    <main class="app-shell">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
