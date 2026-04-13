namespace Shared.Infrastructure.Entities;

public class CheckIn
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Notes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
