namespace TV_IDP.Access.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public List<ChatChannel> Channels { get; set; } = new();
        public List<ChatMessage> Messages { get; set; } = new();
    }
}
