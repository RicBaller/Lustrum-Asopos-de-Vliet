import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Video } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/videos`;

  getAll(categoryId?: number): Observable<Video[]> {
    let params = new HttpParams();
    if (categoryId !== undefined) {
      params = params.set('category', String(categoryId));
    }
    return this.http.get<Video[]>(this.base, { params });
  }

  getById(id: number): Observable<Video> {
    return this.http.get<Video>(`${this.base}/${id}`);
  }
}
