using Microsoft.EntityFrameworkCore;
using TV_IDP.Access.Models;

namespace TV_IDP.Access
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }
}
