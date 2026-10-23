using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context){
        _context = context;
    }
    
    // GET: api/teams
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetTeams(){
        return await _context.Teams.ToListAsync();
    }
    
    // GET: api/teams/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetTeam(int id){
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        return team;
    }
    
    // POST: api/teams
    [HttpPost]
    public async Task<ActionResult<Team>> CreateTeam(Team team){
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return CreatedAtAction(
            nameof(GetTeam),
            new { id = team.Id },
            team
        );
    }
    
    // PUT: api/teams/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(int id, Team team){
        var existingTeam = await _context.Teams.FindAsync(id);
        if (existingTeam == null)
        {
            return NotFound();
        }
        existingTeam.Name = team.Name;
        existingTeam.Country = team.Country;
        existingTeam.PlayersQuantity = team.PlayersQuantity;
        existingTeam.Enabled = team.Enabled;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/teams/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id){
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}