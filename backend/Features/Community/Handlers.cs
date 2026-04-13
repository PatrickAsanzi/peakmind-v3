using MediatR;
using Shared.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Features.Community;

public class CreateCommunityCommandHandler : IRequestHandler<CreateCommunityCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateCommunityCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateCommunityCommand request, CancellationToken cancellationToken)
    {
        var entry = new Shared.Infrastructure.Entities.Community { Id = Guid.NewGuid(), Name = request.Name, Description = request.Description };
        _db.Communities.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetCommunityByIdHandler : IRequestHandler<GetCommunityByIdQuery, Shared.Infrastructure.Entities.Community?>
{
    private readonly PeakMindDbContext _db;
    public GetCommunityByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Shared.Infrastructure.Entities.Community?> Handle(GetCommunityByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Communities.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
    }
}
