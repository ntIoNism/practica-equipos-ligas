import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { League } from '../models/league';

@Service()
export class Leagues {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:5157/api/leagues';

    getLeagues(): Observable<League[]> {
        return this.http.get<League[]>(
            this.apiUrl
        );
    }

    getLeague(id: number): Observable<League> {
        return this.http.get<League>(
            `${this.apiUrl}/${id}`
        );
    }

    createLeague(league: League): Observable<League> {
        return this.http.post<League>(
            this.apiUrl, league
        );
    }

    updateLeague(id: number, league: League): Observable<void> {
        return this.http.put<void>(
            `${this.apiUrl}/${id}`, league
        );
    }

    deleteLeague(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
