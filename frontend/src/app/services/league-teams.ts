import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LeagueTeam } from '../models/league-team';

@Service()
export class LeagueTeams {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:5157/api/leagueteams';

    getLeagueTeams(): Observable<LeagueTeam[]> {
        return this.http.get<LeagueTeam[]>(
            this.apiUrl
        );
    }

    addTeamToLeague(leagueId: number, teamId: number): Observable<string> {
        return this.http.post(
        `${this.apiUrl}/league/${leagueId}/team/${teamId}`,
        {},
        {
            responseType: 'text',
        },
        );
    }

    removeTeamFromLeague(leagueId: number, teamId: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/league/${leagueId}/team/${teamId}`
        );
    }
}
