using backend.Shared.Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Shared.Infrastructure.Entities;

namespace Shared.Infrastructure;

public class PeakMindDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public PeakMindDbContext(DbContextOptions<PeakMindDbContext> options) : base(options)
    {
    }

    public DbSet<CheckIn> CheckIns => Set<CheckIn>();
    public DbSet<CheckInQuestion> CheckInQuestions => Set<CheckInQuestion>();
    public DbSet<LeadershipFeedback> LeadershipFeedbacks => Set<LeadershipFeedback>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Community> Communities => Set<Community>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<OrgInsight> OrgInsights => Set<OrgInsight>();
    public DbSet<CheckInResponse> CheckInResponses => Set<CheckInResponse>();
}
