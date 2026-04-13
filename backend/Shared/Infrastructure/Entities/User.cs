using Microsoft.AspNetCore.Identity;

namespace Shared.Infrastructure.Entities;

public class User : IdentityUser<Guid>
{
    public string? Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
