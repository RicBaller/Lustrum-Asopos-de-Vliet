import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  getAll(categoryId?: number): Observable<Product[]> {
    const params = this.getParams(categoryId);
    return this.http.get<Product[]>(this.base, { params });
  }

  getFeatured(categoryId?: number): Observable<Product[]> {
    const params = this.getParams(categoryId);
    return this.http.get<Product[]>(`${this.base}/featured`, { params });
  }

  private getParams(categoryId?: number): HttpParams {
    let params = new HttpParams();
    if (categoryId !== undefined) {
      params = params.set('category', String(categoryId));
    }

    return params;
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}
