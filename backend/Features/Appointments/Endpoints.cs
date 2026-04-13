using MediatR;

namespace Features.Appointments;

public static class AppointmentsEndpoints
{
    public static void MapAppointmentsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/appointments");

        group.MapPost("/", async (IMediator mediator, CreateAppointmentCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/appointments/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetAppointmentByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
