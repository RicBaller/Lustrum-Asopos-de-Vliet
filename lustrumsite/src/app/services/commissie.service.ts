import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommissieLid, SubCommissie } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CommissieService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/commissie`;

  getLustrumCommissie(): Observable<CommissieLid[]> {
    return this.http.get<CommissieLid[]>(this.base);
  }

  getSubcommissies(): Observable<SubCommissie[]> {
    return this.http.get<SubCommissie[]>(`${this.base}/subcommissies`);
  }

  getSubcommissie(id: number): Observable<SubCommissie> {
    return this.http.get<SubCommissie>(`${this.base}/subcommissies/${id}`);
  }
}
