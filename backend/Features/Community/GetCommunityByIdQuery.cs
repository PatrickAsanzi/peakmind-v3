using MediatR;

namespace Features.Community;

public record GetCommunityByIdQuery(Guid Id) : IRequest<Shared.Infrastructure.Entities.Community?>;
