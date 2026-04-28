using System;
using backend.Features.CheckIns;
using backend.Shared.Infrastructure.Entities;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;

namespace Features.CheckIns;

public class CreateCheckInCommandHandler(PeakMindDbContext _db)
: IRequestHandler<CreateCheckInCommand, Guid>
{
    public async Task<Guid> Handle(
        CreateCheckInCommand request,
        CancellationToken cancellationToken)
    {
        var checkinId = Guid.NewGuid();
        var entry = new CheckIn
        {
            Id = checkinId,
            UserId = request.UserId,
            Notes = request.Notes,
            Responses = request.Responses
            .Select(x => new CheckInResponse()
            {
                Id = Guid.NewGuid(),
                Key = x.Key,
                Emoji = x.Emoji,
                Value = x.Value,
                CheckInId = checkinId,
            }).ToList()
        };
        _db.CheckIns.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetCheckInByIdHandler(PeakMindDbContext _db)
    : IRequestHandler<GetCheckInByIdQuery, CheckInDto?>
{
    public async Task<CheckInDto?> Handle(
        GetCheckInByIdQuery request,
        CancellationToken cancellationToken)
    {
        return await _db.CheckIns
            .Include(x => x.Responses)
            .Where(c => c.Id == request.Id)
            .Select(checkIn => new CheckInDto
            {
                Id = checkIn.Id,
                UserId = checkIn.UserId,
                Notes = checkIn.Notes,
                CreatedAt = checkIn.CreatedAt,
                Responses = checkIn.Responses.Select(r => new CheckInResponseDto
                {
                    Id = r.Id,
                    Key = r.Key,
                    Emoji = r.Emoji,
                    Value = r.Value,
                }).ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
public class GetUserCheckInsHandler(PeakMindDbContext _db)
    : IRequestHandler<GetUserCheckInsQuery, List<CheckInDto>>
{
    public async Task<List<CheckInDto>> Handle(
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
            .Include(x => x.Responses)
            .Select(checkIn => new CheckInDto
            {
                Id = checkIn.Id,
                UserId = checkIn.UserId,
                Notes = checkIn.Notes,
                CreatedAt = checkIn.CreatedAt,
                Responses = checkIn.Responses.Select(r => new CheckInResponseDto
                {
                    Id = r.Id,
                    Key = r.Key,
                    Emoji = r.Emoji,
                    Value = r.Value,
                }).ToList()
            })
            .ToListAsync(cancellationToken);
    }
}

public class UpdateCheckInCommandHandler(PeakMindDbContext _db)
    : IRequestHandler<UpdateCheckInCommand, bool>
{
    public async Task<bool> Handle(UpdateCheckInCommand request, CancellationToken cancellationToken)
    {
        var checkin = await _db.CheckIns.Include(c => c.Responses).FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (checkin is null)
            throw new KeyNotFoundException("Check-in not found");
        // Update notes only if changed
        if (request.Dto.Notes is not null && checkin.Notes != request.Dto.Notes)
        {
            checkin.Notes = request.Dto.Notes;
        }

        // Update existing responses in-place based on the Key (do not delete or create new rows)
        foreach (var incoming in request.Dto.Responses)
        {
            var existing = checkin.Responses.FirstOrDefault(r => string.Equals(r.Key, incoming.Key, StringComparison.OrdinalIgnoreCase));
            if (existing is not null)
            {
                if (existing.Emoji != incoming.Emoji)
                    existing.Emoji = incoming.Emoji;
                if (existing.Value != incoming.Value)
                    existing.Value = incoming.Value;
            }
            // If no existing response matches the incoming key, do NOT create a new row
        }

        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }
}
