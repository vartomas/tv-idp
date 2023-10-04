using System.Text.Json.Serialization;
using TV_IDP.Access.Models.Chat;

namespace TV_IDP.Access.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        [JsonIgnore]
        public List<ChatChannel> Channels { get; set; } = new();
        [JsonIgnore]
        public List<ChatMessage> Messages { get; set; } = new();
    }
}
