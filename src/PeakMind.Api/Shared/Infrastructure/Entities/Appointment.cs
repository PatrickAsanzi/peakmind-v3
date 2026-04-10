namespace PeakMind.Api.Shared.Infrastructure.Entities;

public class Appointment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
