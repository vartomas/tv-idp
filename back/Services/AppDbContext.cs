using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;
using TV_IDP.Access.Models.Chat;
using TV_IDP.Access.Models.Chess;

namespace TV_IDP.Services
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<ChatChannel> ChatChannels { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChessGame> ChessGames { get; set; }
    }
}
