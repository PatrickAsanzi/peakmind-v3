using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PeakMind.Api.Shared.Behaviors;
using PeakMind.Api.Shared.Infrastructure;
using PeakMind.Api.Features.Auth;
using PeakMind.Api.Features.CheckIns;
using PeakMind.Api.Features.LeadershipFeedback;
using PeakMind.Api.Features.Articles;
using PeakMind.Api.Features.Community;
using PeakMind.Api.Features.Notifications;
using PeakMind.Api.Features.Appointments;
using PeakMind.Api.Features.OrgInsights;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var configuration = builder.Configuration;

// Services
builder.Services.AddDbContext<PeakMindDbContext>(options =>
    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

var app = builder.Build();

app.MapGet("/", () => Results.Ok("PeakMind API - .NET 9 Minimal API with Vertical Slices"));

// Map feature endpoints
app.MapAuthEndpoints();
app.MapCheckInsEndpoints();
app.MapLeadershipFeedbackEndpoints();
app.MapArticlesEndpoints();
app.MapCommunityEndpoints();
app.MapNotificationsEndpoints();
app.MapAppointmentsEndpoints();
app.MapOrgInsightsEndpoints();

app.Run();
