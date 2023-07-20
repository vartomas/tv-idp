using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Model;

namespace TV_IDP.Access
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Post> Posts { get; set; }
    }
}
