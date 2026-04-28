namespace Shared.Infrastructure.Entities;

public class CheckInQuestion
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string[] Labels { get; set; } = [];
    public string[] Emojis { get; set; } = [];
    public string Color { get; set; } = string.Empty;
    public bool Inverse { get; set; } = false;
    public bool Optional { get; set; } = false;
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
