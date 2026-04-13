using MediatR;

namespace Features.OrgInsights;

public record CreateOrgInsightCommand(string Title, string Summary) : IRequest<Guid>;
