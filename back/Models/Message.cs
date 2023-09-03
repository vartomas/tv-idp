namespace TV_IDP.Models
{
    public class Message
    {
        public required string Body { get; set; }
        public required string Username { get; set; }
        public required string Type { get; set; }
        public required Guid Id { get; set; }
        public List<string>? ConnectedUsers { get; set; }
        public required string ChannelId { get; set; }
    }
}
