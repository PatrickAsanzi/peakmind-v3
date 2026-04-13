using MediatR;

namespace Features.Appointments;

public record CreateAppointmentCommand(Guid UserId, DateTime StartsAt, DateTime EndsAt, string Title) : IRequest<Guid>;
