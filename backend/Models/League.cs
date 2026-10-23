using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class League
{
    public int Id { get; set; }

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string Country { get; set; } = string.Empty;

    [Required]
    public DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);

    [Required]
    public DateOnly EndDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);

    public bool Enabled { get; set; } = true;

    public ICollection<LeagueTeam> LeagueTeams { get; set; }
        = new List<LeagueTeam>();
}