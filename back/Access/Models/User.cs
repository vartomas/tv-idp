using System.Text.Json.Serialization;

namespace TV_IDP.Access.Models
{
    public class User
    {
        public int Id { get; set; }

        public required string Username { get; set; }

        [JsonIgnore]
        public required string Password { get; set; }
    }
}
