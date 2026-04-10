using MediatR;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace PeakMind.Api.Features.Community;

public class CreateCommunityCommandHandler : IRequestHandler<CreateCommunityCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateCommunityCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateCommunityCommand request, CancellationToken cancellationToken)
    {
        var entry = new Community { Id = Guid.NewGuid(), Name = request.Name, Description = request.Description };
        _db.Communities.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetCommunityByIdHandler : IRequestHandler<GetCommunityByIdQuery, Community?>
{
    private readonly PeakMindDbContext _db;
    public GetCommunityByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Community?> Handle(GetCommunityByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Communities.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
    }
}
