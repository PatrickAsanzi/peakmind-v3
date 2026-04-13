using MediatR;

namespace Features.Appointments;

public record GetAppointmentByIdQuery(Guid Id) : IRequest<Shared.Infrastructure.Entities.Appointment?>;
