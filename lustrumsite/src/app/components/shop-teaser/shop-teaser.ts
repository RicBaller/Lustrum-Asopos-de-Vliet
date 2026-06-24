import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-teaser',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="shop-teaser" id="shop">
      <div class="shop-teaser__inner">
        <div class="shop-teaser__copy">
          <p class="shop-teaser__eyebrow">Shop</p>
          <h2 class="shop-teaser__title">
            <span class="shop-teaser__title-top">Maak je lustrumjaar</span>
            <span class="shop-teaser__title-bottom">tastbaar</span>
          </h2>
          <p class="shop-teaser__text">
            Herinneringen vervagen, het lustrumjaar blijft tastbaar. 
            Shop lustrummerch om nooit meer te vergeten. 
            Claim de merch nu voor jezelf, je huisgenoten en je ploeg en ga samen de tijd voorbij.
          </p>
        </div>

        <div class="shop-teaser__actions">
          <a routerLink="/shop" class="shop-teaser__button">Naar de webshop</a>
        </div>
      </div>

      <div class="shop-teaser__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 C300,110 620,10 900,60 C1130,100 1290,30 1440,70 L1440,120 L0,120 Z" fill="var(--surface)"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .shop-teaser {
      position: relative;
      overflow: hidden;
      background: var(--primary-fixed);
      padding: calc(5.5rem + 80px) var(--spacing-gutter) calc(5.5rem + 90px);
    }

    .shop-teaser__inner {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: clamp(2rem, 6vw, 6rem);
      align-items: end;
    }

    .shop-teaser__eyebrow {
      color: var(--surface);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .shop-teaser__title {
      margin-top: 1rem;
      color: var(--surface);
      display: flex;
      flex-direction: column;
      line-height: 1;
      letter-spacing: -0.04em;
      text-transform: uppercase;
    }

    .shop-teaser__title-top {
      font-size: clamp(1.4rem, 3vw, 2.5rem);
      font-weight: 200;
      letter-spacing: -0.02em;
    }

    .shop-teaser__title-bottom {
      font-size: clamp(3.5rem, 9vw, 8rem);
      font-weight: 900;
      font-style: italic;
      line-height: 0.85;
      letter-spacing: -0.05em;
    }

    .shop-teaser__text {
      max-width: 34rem;
      margin-top: 1.2rem;
      color: var(--on-primary);
      font-size: 1.02rem;
      line-height: 1.8;
    }

    .shop-teaser__actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .shop-teaser__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3.5rem;
      min-width: 15rem;
      padding: 0.9rem 2rem;
      border: 0;
      border-radius: var(--radius-pill);
      background: var(--surface);
      color: var(--text-primary);
      font-family: var(--font-body);
      font-size: 0.84rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    }

    .shop-teaser__button:hover {
      transform: translateY(-2px);
      background: var(--secondary);
      color: var(--on-secondary);
    }

    .shop-teaser__wave {
      position: absolute;
      right: 0;
      bottom: -2px;
      left: 0;
      line-height: 0;
    }

    .shop-teaser__wave svg {
      display: block;
      width: 100%;
      height: 120px;
    }

    @media (max-width: 820px) {
      .shop-teaser__inner {
        grid-template-columns: 1fr;
        align-items: start;
      }

      .shop-teaser__actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      .shop-teaser {
        padding-top: 4.5rem;
      }

      .shop-teaser__button {
        width: 100%;
      }
    }
  `],
})
export class ShopTeaser {}