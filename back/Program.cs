using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TV_IDP.Authorization;
using TV_IDP.Helpers;
using TV_IDP.Services;
using TV_IDP.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("SignalRJwtPolicy", policy =>
    policy.Requirements.Add(new SignalRJwtRequirement()));
});

builder.Services.AddSignalR();

var connectionString = builder.Configuration.GetConnectionString("AZURE_SQL_CONNECTION_STRING");
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddTransient<IJwtUtils, JwtUtils>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IAuthorizationHandler, SignalRJwtAuthorizationHandler>();

var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();
builder.Services.Configure<JwtSettings>(configuration.GetSection("JWT"));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthorization();
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();
app.MapFallbackToFile("index.html");
app.MapHub<ChatHub>("/ws/chat");

app.Run();
