import { TestBed } from '@angular/core/testing';
import { LeagueTeams } from './league-teams';

describe('LeagueTeams', () => {
  let service: LeagueTeams;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueTeams);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
