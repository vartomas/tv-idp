namespace TV_IDP.Access.Models.Chat
{
    public class ChatChannel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<User> Users { get; set; } = new();
        public List<ChatMessage> Messages { get; set; } = new();
    }
}
