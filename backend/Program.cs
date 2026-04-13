using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Features.Auth;
using Features.CheckIns;
using Features.LeadershipFeedback;
using Features.Articles;
using Features.Community;
using Features.Notifications;
using Features.Appointments;
using Features.OrgInsights;
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

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
app.MapLeadershipFeedbackEndpoints();
app.MapArticlesEndpoints();
app.MapCommunityEndpoints();
app.MapNotificationsEndpoints();
app.MapAppointmentsEndpoints();
app.MapOrgInsightsEndpoints();

app.Run();

