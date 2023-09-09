using System.Text.Json.Serialization;

namespace TV_IDP.Access.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public required string Type { get; set; }
        public required string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
        public int ChannelId { get; set; }
        [JsonIgnore]
        public ChatChannel? Channel { get; set; }
    }
}
