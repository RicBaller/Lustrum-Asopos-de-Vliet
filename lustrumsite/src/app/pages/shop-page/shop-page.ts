import { CurrencyPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
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
  host: {
    '(document:keydown.escape)': 'closeDialog()',
  },
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css', './shop-page-featured.css', './shop-page-collectie.css', './shop-page-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopPage implements OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly document = inject(DOCUMENT);

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

  readonly selectedProduct = signal<Product | null>(null);
  readonly isClosingDialog = signal(false);
  readonly activeImageIndex = signal(0);

  private dialogCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  openDialog(product: Product): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
      this.dialogCloseTimeout = null;
    }
    this.isClosingDialog.set(false);
    this.selectedProduct.set(product);
    this.activeImageIndex.set(0);
    this.document.body.style.overflow = 'hidden';
  }

  closeDialog(): void {
    if (this.isClosingDialog() || !this.selectedProduct()) return;
    this.isClosingDialog.set(true);
    this.dialogCloseTimeout = setTimeout(() => {
      this.dialogCloseTimeout = null;
      this.selectedProduct.set(null);
      this.isClosingDialog.set(false);
      this.document.body.style.overflow = '';
    }, 300);
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const images = this.selectedProduct()?.images ?? [];
    if (images.length <= 1) return;
    this.activeImageIndex.update(i => (i - 1 + images.length) % images.length);
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const images = this.selectedProduct()?.images ?? [];
    if (images.length <= 1) return;
    this.activeImageIndex.update(i => (i + 1) % images.length);
  }

  setImage(index: number, event: Event): void {
    event.stopPropagation();
    this.activeImageIndex.set(index);
  }

  ngOnDestroy(): void {
    if (this.dialogCloseTimeout !== null) {
      clearTimeout(this.dialogCloseTimeout);
      this.dialogCloseTimeout = null;
    }
    this.document.body.style.overflow = '';
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

