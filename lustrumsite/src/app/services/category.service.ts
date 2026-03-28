import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategorySummary } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/categories`;

  getAll(): Observable<CategorySummary[]> {
    return this.http.get<CategorySummary[]>(this.base);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }
}
