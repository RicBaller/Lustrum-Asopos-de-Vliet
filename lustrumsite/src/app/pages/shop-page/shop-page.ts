import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, timeout } from 'rxjs';
import { Product } from '../../models/models';
import { ProductService } from '../../services/product.service';

interface ProductGroup {
  id: string;
  title: string;
  products: Product[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-shop-page',
  imports: [CurrencyPipe],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPage {
  private readonly productService = inject(ProductService);

  private readonly state = toSignal(
    this.productService.getAll().pipe(
      timeout(10_000),
      map((data): ProductState => ({
        products: data,
        loading: false,
        error: null,
      })),
      catchError(() => of({
        products: [],
        loading: false,
        error: 'Producten konden niet worden geladen.',
      } satisfies ProductState)),
      startWith({
        products: [],
        loading: true,
        error: null,
      } satisfies ProductState)
    ),
    {
      initialValue: {
        products: [],
        loading: true,
        error: null,
      } satisfies ProductState,
    }
  );

  readonly loading = computed(() => this.state().loading);
  readonly error   = computed(() => this.state().error);

  readonly featured = computed(() =>
    this.state().products.filter(p => p.isSpotlight)
  );

  readonly productGroups = computed(() => {
    const groups: ProductGroup[] = [];
    const grouped = new Map<string, ProductGroup>();

    for (const product of this.state().products) {
      const groupId = product.category ? String(product.category.id) : 'uncategorized';
      const groupTitle = product.category?.title ?? 'Overig';

      let group = grouped.get(groupId);
      if (!group) {
        group = { id: groupId, title: groupTitle, products: [] };
        grouped.set(groupId, group);
        groups.push(group);
      }

      group.products.push(product);
    }

    return groups;
  });

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

