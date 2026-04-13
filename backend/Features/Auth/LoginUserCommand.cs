using MediatR;

namespace Features.Auth;

public record LoginUserCommand(string Email, string Password) : IRequest<TokenResponse>;
