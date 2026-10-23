using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LeaguesController : ControllerBase{
    private readonly AppDbContext _context;

    public LeaguesController(AppDbContext context){
        _context = context;
    }

    // GET: api/leagues
    [HttpGet]
    public async Task<ActionResult<IEnumerable<League>>> GetLeagues(){
        return await _context.Leagues.ToListAsync();
    }

    // GET: api/leagues/1
    [HttpGet("{id}")]
    public async Task<ActionResult<League>> GetLeague(int id){
        var league = await _context.Leagues.FindAsync(id);
        if (league == null)
        {
            return NotFound();
        }
        return league;
    }

    // POST: api/leagues
    [HttpPost]
    public async Task<ActionResult<League>> CreateLeague(League league){
        // Validación especial de fechas
        if (league.StartDate > league.EndDate)
        {
            return BadRequest(
                "La fecha de inicio no puede ser mayor que la fecha de fin."
            );
        }
        _context.Leagues.Add(league);
        await _context.SaveChangesAsync();
        return CreatedAtAction(
            nameof(GetLeague),
            new { id = league.Id },
            league
        );
    }

    // PUT: api/leagues/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLeague(int id, League league){
        var existingLeague =
            await _context.Leagues.FindAsync(id);
        if (existingLeague == null)
        {
            return NotFound();
        }
        // Validación especial de fechas
        if (league.StartDate > league.EndDate)
        {
            return BadRequest(
                "La fecha de inicio no puede ser mayor que la fecha de fin."
            );
        }
        existingLeague.Name = league.Name;
        existingLeague.Country = league.Country;
        existingLeague.StartDate = league.StartDate;
        existingLeague.EndDate = league.EndDate;
        existingLeague.Enabled = league.Enabled;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/leagues/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeague(int id){
        var league =
            await _context.Leagues.FindAsync(id);
        if (league == null)
        {
            return NotFound();
        }
        _context.Leagues.Remove(league);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}