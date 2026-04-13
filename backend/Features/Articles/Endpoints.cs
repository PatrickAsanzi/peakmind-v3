using MediatR;

namespace Features.Articles;

public static class ArticlesEndpoints
{
    public static void MapArticlesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/articles");

        group.MapPost("/", async (IMediator mediator, CreateArticleCommand cmd) =>
        {
            var id = await mediator.Send(cmd);
            return Results.Created($"/articles/{id}", id);
        });

        group.MapGet("/{id}", async (IMediator mediator, Guid id) =>
        {
            var item = await mediator.Send(new GetArticleByIdQuery(id));
            return item is not null ? Results.Ok(item) : Results.NotFound();
        });
    }
}
