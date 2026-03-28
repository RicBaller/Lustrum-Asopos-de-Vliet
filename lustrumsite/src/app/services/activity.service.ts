import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/activities`;

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.base);
  }

  getById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.base}/${id}`);
  }
}
