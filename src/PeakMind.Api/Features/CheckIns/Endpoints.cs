using MediatR;

namespace PeakMind.Api.Features.CheckIns;

public static class CheckInsEndpoints
{
    public static void MapCheckInsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/checkins");

        group.MapPost("/", async (IMediator mediator, CreateCheckInCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/checkins/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetCheckInByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
