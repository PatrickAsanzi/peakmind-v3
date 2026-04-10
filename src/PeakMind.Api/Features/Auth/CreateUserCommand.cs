using MediatR;

namespace PeakMind.Api.Features.Auth;

public record CreateUserCommand(string Email, string? Name) : IRequest<Guid>;
