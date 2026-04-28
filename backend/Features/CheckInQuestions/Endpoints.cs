using MediatR;

namespace Features.CheckInQuestions;

public static class CheckInQuestionsEndpoints
{
    public static void MapCheckInQuestionsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/checkin-questions");

        group.MapGet("/", GetCheckInQuestions)
            .WithName("GetCheckInQuestions")
            .WithOpenApi();
    }

    private static async Task<IResult> GetCheckInQuestions(IMediator mediator)
    {
        var questions = await mediator.Send(new GetCheckInQuestionsQuery());
        return Results.Ok(questions);
    }
}
