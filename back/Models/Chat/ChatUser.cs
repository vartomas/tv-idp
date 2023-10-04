namespace TV_IDP.Models.Chat
{
    public class ChatUser
    {
        public required int Id { get; set; }
        public required string Username { get; set; }
        public required string ConnectionId { get; set; }
    }
}
