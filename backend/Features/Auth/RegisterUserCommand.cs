using MediatR;

namespace Features.Auth;

public record RegisterUserCommand(string Email, string Password, string? Name) : IRequest<Guid>;
