using MediatR;

namespace Features.Community;

public static class CommunityEndpoints
{
    public static void MapCommunityEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/communities");

        group.MapPost("/", async (IMediator mediator, CreateCommunityCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/communities/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetCommunityByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
