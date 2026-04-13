using MediatR;

namespace Features.OrgInsights;

public record GetOrgInsightByIdQuery(Guid Id) : IRequest<Shared.Infrastructure.Entities.OrgInsight?>;
