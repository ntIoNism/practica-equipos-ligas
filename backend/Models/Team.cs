using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class Team
    {
        public int Id { get; set;}

        [Required]
        [MaxLength(50)]
        [MinLength(2)]
        public string Name { get; set;} = string.Empty;

        [Required]
        [MaxLength(50)]
        [MinLength(2)]
        public string Country { get; set;} = string.Empty;

        [Required]
        [Range(11, 22)]
        public int PlayersQuantity { get; set;}

        public bool Enabled { get; set;} = true;

        public ICollection<LeagueTeam> LeagueTeams { get; set;} = new List<LeagueTeam>();

    }
}