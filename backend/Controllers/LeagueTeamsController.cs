using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeagueTeamsController : ControllerBase{
    private readonly AppDbContext _context;

    public LeagueTeamsController(AppDbContext context){
        _context = context;
    }
    //GET: api/LeagueTeams
    [HttpGet]
    public async Task<ActionResult> GetLeagueTeams(){
        var relaciones = await _context.LeagueTeams
            .Select(lt => new
            {
                LeagueId = lt.LeagueId,
                LeagueName = lt.League.Name,
                TeamId = lt.TeamId,
                TeamName = lt.Team.Name
            })
            .ToListAsync();
        return Ok(relaciones);
    }

    // POST: api/leagueteams/league/1/team/2
    [HttpPost("league/{leagueId}/team/{teamId}")]
    public async Task<IActionResult> AddTeamToLeague(int leagueId, int teamId){
        // Comprobar que exista la liga
        var leagueExists =
            await _context.Leagues.AnyAsync(
                l => l.Id == leagueId
            );
        if (!leagueExists)
        {
            return NotFound("La liga no existe.");
        }
        // Comprobar que exista el equipo
        var teamExists =
            await _context.Teams.AnyAsync(
                t => t.Id == teamId
            );
        if (!teamExists)
        {
            return NotFound("El equipo no existe.");
        }
        // Comprobar que no esté ya inscrito
        var relationExists =
            await _context.LeagueTeams.AnyAsync(
                lt =>
                    lt.LeagueId == leagueId &&
                    lt.TeamId == teamId
            );
        if (relationExists)
        {
            return Conflict(
                "El equipo ya está inscrito en esta liga."
            );
        }
        var leagueTeam = new LeagueTeam
        {
            LeagueId = leagueId,
            TeamId = teamId
        };
        _context.LeagueTeams.Add(leagueTeam);
        await _context.SaveChangesAsync();
        return Ok("Equipo inscrito correctamente.");
    }

    // DELETE: api/leagueteams/league/1/team/2
    [HttpDelete("league/{leagueId}/team/{teamId}")]
    public async Task<IActionResult> RemoveTeamFromLeague(int leagueId, int teamId){
        var relation =
            await _context.LeagueTeams.FindAsync(
                leagueId,
                teamId
            );
        if (relation == null)
        {
            return NotFound(
                "El equipo no está inscrito en esta liga."
            );
        }
        _context.LeagueTeams.Remove(relation);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}