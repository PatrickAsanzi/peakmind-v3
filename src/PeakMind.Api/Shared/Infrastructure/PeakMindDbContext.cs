using Microsoft.EntityFrameworkCore;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Shared.Infrastructure;

public class PeakMindDbContext : DbContext
{
    public PeakMindDbContext(DbContextOptions<PeakMindDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<LeadershipFeedback> LeadershipFeedbacks => Set<LeadershipFeedback>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Community> Communities => Set<Community>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<OrgInsight> OrgInsights => Set<OrgInsight>();
}
