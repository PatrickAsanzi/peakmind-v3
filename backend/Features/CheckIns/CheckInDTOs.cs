namespace backend.Features.CheckIns
{
    public class CreateCheckInDto
    {
        public Guid UserId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<CreateCheckInResponseDto> Responses { get; set; } = [];
    }

    public class CreateCheckInResponseDto
    {
        public string Key { get; set; } = string.Empty;
        public string Emoji { get; set; } = string.Empty;
        public int Value { get; set; }
    }
    public class CheckInResponseDto
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string Emoji { get; set; } = string.Empty;
        public int Value { get; set; }
    }

    public class CheckInDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<CheckInResponseDto> Responses { get; set; } = [];
    }
}
