using MediatR;
using Shared.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Features.OrgInsights;

public class CreateOrgInsightCommandHandler : IRequestHandler<CreateOrgInsightCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateOrgInsightCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateOrgInsightCommand request, CancellationToken cancellationToken)
    {
        var entry = new Shared.Infrastructure.Entities.OrgInsight { Id = Guid.NewGuid(), Title = request.Title, Summary = request.Summary };
        _db.OrgInsights.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetOrgInsightByIdHandler : IRequestHandler<GetOrgInsightByIdQuery, Shared.Infrastructure.Entities.OrgInsight?>
{
    private readonly PeakMindDbContext _db;
    public GetOrgInsightByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Shared.Infrastructure.Entities.OrgInsight?> Handle(GetOrgInsightByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.OrgInsights.FirstOrDefaultAsync(o => o.Id == request.Id, cancellationToken);
    }
}
