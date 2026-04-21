using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Features.CheckIns;

public static class CheckInsEndpoints
{
    public static void MapCheckInsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/checkins");

        group.MapPost("/", async (
            IMediator mediator,
            CreateCheckInCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/checkins/{id}", id);
        });

        group.MapGet("/{id}", async (
            IMediator mediator,
            Guid id) =>
        {
            var item = await mediator.Send(new GetCheckInByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });

        group.MapGet("/user/{userId}", async (
            Guid userId,
            [FromQuery] int? days,
            IMediator mediator) =>
        {
            var result = await mediator.Send(
                new GetUserCheckInsQuery(userId, days)
            );

            return Results.Ok(result);
        });
    }
}
