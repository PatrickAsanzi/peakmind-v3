namespace Features.Auth;

public record TokenResponse(string Token, DateTime ExpiresAt);
