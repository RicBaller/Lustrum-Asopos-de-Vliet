import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Album, AlbumSummary } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/albums`;

  getAll(): Observable<AlbumSummary[]> {
    return this.http.get<AlbumSummary[]>(this.base);
  }

  getById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.base}/${id}`);
  }
}
