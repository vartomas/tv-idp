namespace TV_IDP.Models
{
    public class ChatMessage
    {
        public required string Message { get; set; }
        public required string Username { get; set; }
        public required string Type { get; set; }
        public required Guid Id { get; set; }
        public List<string> ConnectedUsers { get; set; } = new();
    }
}
