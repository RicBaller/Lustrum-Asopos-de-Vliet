import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sponsor } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sponsors`;

  getSponsors(): Observable<Sponsor[]> {
    return this.http.get<Sponsor[]>(this.base);
  }

  getSponsor(id: number): Observable<Sponsor> {
    return this.http.get<Sponsor>(`${this.base}/${id}`);
  }
}
