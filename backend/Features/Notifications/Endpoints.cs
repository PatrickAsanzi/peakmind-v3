using MediatR;

namespace Features.Notifications;

public static class NotificationsEndpoints
{
    public static void MapNotificationsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/notifications");

        group.MapPost("/", async (IMediator mediator, CreateNotificationCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/notifications/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetNotificationByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
