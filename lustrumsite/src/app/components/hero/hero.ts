import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrefetchOnInteractionDirective } from '../../directives/prefetch-on-interaction.directive';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrls: [`./hero.scss`],
  imports: [RouterLink, PrefetchOnInteractionDirective],
})
export class Hero {}
