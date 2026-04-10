using MediatR;

namespace PeakMind.Api.Features.LeadershipFeedback;

public static class LeadershipFeedbackEndpoints
{
    public static void MapLeadershipFeedbackEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/leadership-feedback");

        group.MapPost("/", async (IMediator mediator, CreateLeadershipFeedbackCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/leadership-feedback/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetLeadershipFeedbackByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
