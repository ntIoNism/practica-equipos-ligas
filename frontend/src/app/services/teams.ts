import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Team } from '../models/team';

@Service()
export class Teams {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5157/api/teams';

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.apiUrl);
    }

    getTeam(id: number): Observable<Team> {
        return this.http.get<Team>(
            `${this.apiUrl}/${id}`
        );
    }


    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(
            this.apiUrl,
            team
        );
    }
    
    updateTeam(id: number, team: Team): Observable<void>{
        return this.http.put<void>(
        `${this.apiUrl}/${id}`,
        team
        );
    }

    deleteTeam(id: number): Observable<void>{
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}