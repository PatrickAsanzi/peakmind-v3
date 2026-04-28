using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Features.Auth;
using Features.CheckIns;
using Features.CheckInQuestions;
using Features.LeadershipFeedback;
using Features.Articles;
using Features.Community;
using Features.Notifications;
using Features.Appointments;
using Features.OrgInsights;
using Features.Dashboard;
using Shared.Behaviors;
using Shared.Infrastructure;
using Shared.Infrastructure.Entities;
using Shared.Infrastructure.Jwt;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var configuration = builder.Configuration;

// Configure DB connection - prefer Docker-provided env vars when available
var pgHost = Environment.GetEnvironmentVariable("POSTGRES_HOST");
string connectionString;
if (!string.IsNullOrEmpty(pgHost))
{
    var pgUser = Environment.GetEnvironmentVariable("POSTGRES_USER") ?? "postgres";
    var pgPass = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD") ?? "postgres";
    var pgDb = Environment.GetEnvironmentVariable("POSTGRES_DB") ?? "postgres";
    var pgPort = Environment.GetEnvironmentVariable("POSTGRES_PORT") ?? "5432";
    connectionString = $"Host={pgHost};Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPass}";
}
else
{
    connectionString = configuration.GetConnectionString("DefaultConnection");
}

builder.Services.AddDbContext<PeakMindDbContext>(options =>
    options.UseNpgsql(connectionString));

// Identity
builder.Services.AddIdentity<User, Microsoft.AspNetCore.Identity.IdentityRole<Guid>>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
    })
    .AddEntityFrameworkStores<PeakMindDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
var jwtSection = configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection.GetValue<string>("Key")!);
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection.GetValue<string>("Issuer"),
            ValidAudience = jwtSection.GetValue<string>("Audience"),
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// Authorization services (required for UseAuthorization and [Authorize] endpoints)
builder.Services.AddAuthorization();

builder.Services.AddMediatR(typeof(Program).Assembly);
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
// CORS - allow development origins and required methods (including PUT/OPTIONS)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseCors();

// Apply EF Core migrations at startup (with simple retry for DB readiness)
{
    var maxAttempts = 10;
    for (int attempt = 0; attempt < maxAttempts; attempt++)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<PeakMindDbContext>();
            db.Database.Migrate();

            // Seed CheckInQuestions if they don't exist
            if (!db.CheckInQuestions.Any())
            {
                var questions = new[]
                {
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "mood",
                        Title = "How are you feeling today?",
                        Description = "Rate your overall mood right now",
                        Labels = new[] { "Very Low", "Low", "Neutral", "Good", "Excellent" },
                        Emojis = new[] { "😔", "😕", "😐", "🙂", "😊" },
                        Color = "bg-primary/10 text-primary",
                        Inverse = false,
                        Optional = false,
                        Order = 1
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "stress",
                        Title = "How stressed do you feel?",
                        Description = "Consider your current mental load",
                        Labels = new[] { "Very Calm", "Calm", "Moderate", "Stressed", "Very Stressed" },
                        Emojis = new[] { "😌", "🙂", "😐", "😰", "😫" },
                        Color = "bg-rose-100 text-rose-600",
                        Inverse = true,
                        Optional = false,
                        Order = 2
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "energy",
                        Title = "What's your energy level?",
                        Description = "Physical and mental energy combined",
                        Labels = new[] { "Exhausted", "Low", "Moderate", "Good", "High Energy" },
                        Emojis = new[] { "😴", "🥱", "😐", "💪", "⚡" },
                        Color = "bg-accent/20 text-amber-600",
                        Inverse = false,
                        Optional = false,
                        Order = 3
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "workload_pressure",
                        Title = "How manageable is your workload?",
                        Description = "Consider deadlines and responsibilities",
                        Labels = new[] { "Very Heavy", "Heavy", "Manageable", "Light", "Very Light" },
                        Emojis = new[] { "😵", "😓", "😐", "🙂", "😎" },
                        Color = "bg-blue-100 text-blue-600",
                        Inverse = true,
                        Optional = false,
                        Order = 4
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "work_satisfaction",
                        Title = "How satisfied are you with your work today?",
                        Description = "Sense of accomplishment and meaning",
                        Labels = new[] { "Very Low", "Low", "Neutral", "Satisfied", "Very Satisfied" },
                        Emojis = new[] { "😞", "😕", "😐", "🙂", "🤩" },
                        Color = "bg-purple-100 text-purple-600",
                        Inverse = false,
                        Optional = false,
                        Order = 5
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "belonging",
                        Title = "How connected do you feel to your team?",
                        Description = "Sense of belonging and psychological safety",
                        Labels = new[] { "Isolated", "Disconnected", "Neutral", "Connected", "Very Connected" },
                        Emojis = new[] { "😢", "😕", "😐", "🤝", "❤️" },
                        Color = "bg-emerald-100 text-emerald-600",
                        Inverse = false,
                        Optional = false,
                        Order = 6
                    },
                    new Shared.Infrastructure.Entities.CheckInQuestion
                    {
                        Id = Guid.NewGuid(),
                        Key = "sleep_quality",
                        Title = "How well did you sleep last night?",
                        Description = "Optional - helps track recovery patterns",
                        Labels = new[] { "Very Poor", "Poor", "Okay", "Good", "Excellent" },
                        Emojis = new[] { "😩", "😕", "😐", "😴", "💤" },
                        Color = "bg-indigo-100 text-indigo-600",
                        Inverse = false,
                        Optional = true,
                        Order = 7
                    }
                };

                db.CheckInQuestions.AddRange(questions);
                await db.SaveChangesAsync();
                Console.WriteLine("CheckInQuestions seed data added successfully.");
            }

            break;
        }
        catch (Exception ex) when (attempt < maxAttempts - 1)
        {
            Console.WriteLine($"Database migration attempt {attempt + 1} failed: {ex.Message}. Retrying in 2s...");
            System.Threading.Thread.Sleep(2000);
        }
    }
}

// Map feature endpoints

app.MapAuthEndpoints();
app.MapCheckInsEndpoints();
app.MapCheckInQuestionsEndpoints();
app.MapDashboardEndpoints();
app.MapLeadershipFeedbackEndpoints();
app.MapArticlesEndpoints();
app.MapCommunityEndpoints();
app.MapNotificationsEndpoints();
app.MapAppointmentsEndpoints();
app.MapOrgInsightsEndpoints();

app.Run();

