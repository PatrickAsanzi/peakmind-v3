using MediatR;

namespace Features.OrgInsights;

public static class OrgInsightsEndpoints
{
    public static void MapOrgInsightsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/org-insights");

        group.MapPost("/", async (IMediator mediator, CreateOrgInsightCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/org-insights/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetOrgInsightByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
