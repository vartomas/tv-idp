namespace TV_IDP.Models
{
    public class Message
    {
        public int Id { get; set; }
        public required string Body { get; set; }
        public required string Username { get; set; }
        public required string Type { get; set; }
        public int ChannelId { get; set; }
    }
}
