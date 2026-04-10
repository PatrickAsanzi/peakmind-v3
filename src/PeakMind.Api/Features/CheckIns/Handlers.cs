using MediatR;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace PeakMind.Api.Features.CheckIns;

public class CreateCheckInCommandHandler : IRequestHandler<CreateCheckInCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateCheckInCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateCheckInCommand request, CancellationToken cancellationToken)
    {
        var entry = new CheckIn { Id = Guid.NewGuid(), UserId = request.UserId, Notes = request.Notes };
        _db.CheckIns.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetCheckInByIdHandler : IRequestHandler<GetCheckInByIdQuery, CheckIn?>
{
    private readonly PeakMindDbContext _db;
    public GetCheckInByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<CheckIn?> Handle(GetCheckInByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.CheckIns.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
    }
}
