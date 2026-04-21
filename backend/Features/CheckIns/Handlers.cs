using MediatR;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Features.CheckIns;

public class CreateCheckInCommandHandler(PeakMindDbContext _db)
: IRequestHandler<CreateCheckInCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateCheckInCommand request,
        CancellationToken cancellationToken)
    {
        var entry = new CheckIn { Id = Guid.NewGuid(), UserId = request.UserId, Notes = request.Notes };
        _db.CheckIns.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetCheckInByIdHandler(PeakMindDbContext _db)
: IRequestHandler<GetCheckInByIdQuery, CheckIn?>
{
    public async Task<CheckIn?> Handle(
        GetCheckInByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await _db.CheckIns.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
    }
}

public class GetUserCheckInsHandler(PeakMindDbContext _db)
    : IRequestHandler<GetUserCheckInsQuery, List<CheckIn>>
{
    public async Task<List<CheckIn>> Handle(
        GetUserCheckInsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _db.CheckIns
            .Where(x => x.UserId == request.UserId);

        if (request.Days.HasValue)
        {
            var fromDate = DateTime.UtcNow.AddDays(-request.Days.Value);

            query = query.Where(x => x.CreatedAt >= fromDate);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
