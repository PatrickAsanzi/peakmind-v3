using MediatR;
using Shared.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Features.Appointments;

public class CreateAppointmentCommandHandler : IRequestHandler<CreateAppointmentCommand, Guid>
{
    private readonly PeakMindDbContext _db;
    public CreateAppointmentCommandHandler(PeakMindDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
        var entry = new Shared.Infrastructure.Entities.Appointment { Id = Guid.NewGuid(), UserId = request.UserId, StartsAt = request.StartsAt, EndsAt = request.EndsAt, Title = request.Title };
        _db.Appointments.Add(entry);
        await _db.SaveChangesAsync(cancellationToken);
        return entry.Id;
    }
}

public class GetAppointmentByIdHandler : IRequestHandler<GetAppointmentByIdQuery, Shared.Infrastructure.Entities.Appointment?>
{
    private readonly PeakMindDbContext _db;
    public GetAppointmentByIdHandler(PeakMindDbContext db) => _db = db;

    public async Task<Shared.Infrastructure.Entities.Appointment?> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
    {
        return await _db.Appointments.FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);
    }
}
