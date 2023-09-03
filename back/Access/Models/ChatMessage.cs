namespace TV_IDP.Access.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public required string Type { get; set; }
        public required string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int ChannelId { get; set; }
        public ChatChannel? Channel { get; set; }
    }
}
