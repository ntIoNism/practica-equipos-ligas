using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<League> Leagues { get; set; } = null!;
    public DbSet<LeagueTeam> LeagueTeams { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LeagueTeam>()
            .HasKey(lt => new { lt.LeagueId, lt.TeamId });

        modelBuilder.Entity<LeagueTeam>()
            .HasOne(lt => lt.League)
            .WithMany(l => l.LeagueTeams)
            .HasForeignKey(lt => lt.LeagueId);

        modelBuilder.Entity<LeagueTeam>()
            .HasOne(lt => lt.Team)
            .WithMany(t => t.LeagueTeams)
            .HasForeignKey(lt => lt.TeamId);
    }
}