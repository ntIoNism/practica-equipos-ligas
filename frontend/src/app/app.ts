import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Modelos
import { Team } from './models/team';
import { League } from './models/league';
import { LeagueTeam } from './models/league-team';
// Servicios
import { Teams } from './services/teams';
import { Leagues } from './services/leagues';
import { LeagueTeams } from './services/league-teams';

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  // Servicios
  private teamsService = inject(Teams);
  private leaguesService = inject(Leagues);
  private leagueTeamsService = inject(LeagueTeams);
  private changeDetector = inject(ChangeDetectorRef);

  // Listas
  teams: Team[] = [];
  leagues: League[] = [];
  leagueTeams: LeagueTeam[] = [];

  // Pestaña activa
activeTab: 'equipos' | 'ligas' | 'inscripciones' = 'equipos';

  // Relación Liga - Equipo
  selectedLeagueId: number | null = null;
  selectedTeamId: number | null = null;

  // Formulario de equipos
  teamForm: Team = {
    id: 0,
    name: '',
    country: '',
    playersQuantity: 11,
    enabled: true,
  };
  editingTeam = false;

  // Formulario de ligas
  leagueForm: League = {
    id: 0,
    name: '',
    country: '',
    startDate: '',
    endDate: '',
    enabled: true,
  };
  editingLeague = false;

  // Cargar datos al iniciar
  ngOnInit(): void {
    this.cargarEquipos();
    this.cargarLigas();
    this.cargarLeagueTeams();
  }

  // EQUIPOS
  // Obtener equipos
  cargarEquipos(): void {
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener equipos:', error);
      },
    });
  }

  // Crear o actualizar equipo
  guardarEquipo(): void {
    if (this.editingTeam) {
      this.actualizarEquipo();
    } else {
      this.crearEquipo();
    }
  }

  // Crear equipo
  crearEquipo(): void {
    this.teamsService.createTeam(this.teamForm).subscribe({
      next: () => {
        this.cargarEquipos();
        this.limpiarEquipo();
      },
      error: (error) => {
        console.error('Error al crear equipo:', error);
      },
    });
  }

  // Cargar datos para editar
  editarEquipo(team: Team): void {
    this.teamForm = {
      ...team,
    };
    this.editingTeam = true;
  }

  // Actualizar equipo
  actualizarEquipo(): void {
    this.teamsService.updateTeam(this.teamForm.id, this.teamForm).subscribe({
      next: () => {
        this.cargarEquipos();
        this.limpiarEquipo();
      },
      error: (error) => {
        console.error('Error al actualizar equipo:', error);
      },
    });
  }

  // Eliminar equipo
  eliminarEquipo(id: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar este equipo?');
    if (!confirmar) {
      return;
    }
    this.teamsService.deleteTeam(id).subscribe({
      next: () => {
        this.cargarEquipos();
        // Actualizar relaciones por si tenía ligas
        this.cargarLeagueTeams();
      },
      error: (error) => {
        console.error('Error al eliminar equipo:', error);
      },
    });
  }

  // Limpiar formulario de equipo
  limpiarEquipo(): void {
    this.teamForm = {
      id: 0,
      name: '',
      country: '',
      playersQuantity: 11,
      enabled: true,
    };
    this.editingTeam = false;
  }

  // LIGAS
  // Obtener ligas
  cargarLigas(): void {
    this.leaguesService.getLeagues().subscribe({
      next: (data) => {
        this.leagues = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener ligas:', error);
      },
    });
  }

  // Crear o actualizar liga
  guardarLiga(): void {
    // Validar fechas
    if (this.leagueForm.startDate > this.leagueForm.endDate) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }
    if (this.editingLeague) {
      this.actualizarLiga();
    } else {
      this.crearLiga();
    }
  }

  // Crear liga
  crearLiga(): void {
    this.leaguesService.createLeague(this.leagueForm).subscribe({
      next: () => {
        this.cargarLigas();
        this.limpiarLiga();
      },
      error: (error) => {
        console.error('Error al crear liga:', error);
      },
    });
  }

  // Cargar liga para editar
  editarLiga(league: League): void {
    this.leagueForm = {
      ...league,
    };
    this.editingLeague = true;
  }

  // Actualizar liga
  actualizarLiga(): void {
    this.leaguesService.updateLeague(this.leagueForm.id, this.leagueForm).subscribe({
      next: () => {
        this.cargarLigas();
        this.limpiarLiga();
        // Actualizar nombres en relaciones
        this.cargarLeagueTeams();
      },
      error: (error) => {
        console.error('Error al actualizar liga:', error);
      },
    });
  }

  // Eliminar liga
  eliminarLiga(id: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar esta liga?');
    if (!confirmar) {
      return;
    }
    this.leaguesService.deleteLeague(id).subscribe({
      next: () => {
        this.cargarLigas();
        // Actualizar relaciones
        this.cargarLeagueTeams();
      },
      error: (error) => {
        console.error('Error al eliminar liga:', error);
      },
    });
  }

  // Limpiar formulario de liga
  limpiarLiga(): void {
    this.leagueForm = {
      id: 0,
      name: '',
      country: '',
      startDate: '',
      endDate: '',
      enabled: true,
    };
    this.editingLeague = false;
  }

  // RELACIÓN LIGAS - EQUIPOS
  // Obtener inscripciones
  cargarLeagueTeams(): void {
    this.leagueTeamsService.getLeagueTeams().subscribe({
      next: (data) => {
        this.leagueTeams = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener relaciones:', error);
      },
    });
  }

  // Inscribir equipo en liga
  inscribirEquipo(): void {
    if (this.selectedLeagueId === null || this.selectedTeamId === null) {
      alert('Selecciona una liga y un equipo.');
      return;
    }
    this.leagueTeamsService.addTeamToLeague(this.selectedLeagueId, this.selectedTeamId).subscribe({
      next: () => {
        this.cargarLeagueTeams();
        // Limpiar selects
        this.selectedLeagueId = null;
        this.selectedTeamId = null;
      },
      error: (error) => {
        console.error('Error al inscribir equipo:', error);
        if (error.status === 409) {
          alert('El equipo ya está inscrito en esa liga.');
        } else if (error.status === 404) {
          alert('La liga o el equipo no existe.');
        } else {
          alert('No se pudo inscribir el equipo.');
        }
      },
    });
  }

  // Quitar equipo de liga
  quitarEquipo(leagueId: number, teamId: number): void {
    const confirmar = confirm('¿Deseas quitar este equipo de la liga?');
    if (!confirmar) {
      return;
    }
    this.leagueTeamsService.removeTeamFromLeague(leagueId, teamId).subscribe({
      next: () => {
        this.cargarLeagueTeams();
      },
      error: (error) => {
        console.error('Error al quitar equipo:', error);
      },
    });
  }
}