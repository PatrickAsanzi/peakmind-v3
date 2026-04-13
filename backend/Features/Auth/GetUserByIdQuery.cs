using MediatR;
using Shared.Infrastructure.Entities;

namespace Features.Auth;

public record GetUserByIdQuery(Guid Id) : IRequest<User?>;
