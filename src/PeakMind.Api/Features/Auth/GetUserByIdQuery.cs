using MediatR;
using PeakMind.Api.Shared.Infrastructure.Entities;

namespace PeakMind.Api.Features.Auth;

public record GetUserByIdQuery(Guid Id) : IRequest<User?>;
