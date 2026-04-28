using Shared.Infrastructure.Entities;

namespace backend.Shared.Infrastructure.Entities
{
    public class CheckInResponse
    {
        public Guid Id { get; set; }
        public Guid CheckInId { get; set; }
        public string Key { get; set; } = string.Empty;   // "mood", "stress", etc.
        public string Emoji { get; set; } = string.Empty; // Optional emoji representation
        public int Value { get; set; }
        public CheckIn CheckIn { get; set; } = null!;
    }
}

