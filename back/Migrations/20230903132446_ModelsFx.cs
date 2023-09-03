using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TV_IDP.Migrations
{
    /// <inheritdoc />
    public partial class ModelsFx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "ChannelId",
                table: "ChatMessages",
                newName: "ChatChannelId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatMessages_ChannelId",
                table: "ChatMessages",
                newName: "IX_ChatMessages_ChatChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChatChannelId",
                table: "ChatMessages",
                column: "ChatChannelId",
                principalTable: "ChatChannels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChatChannelId",
                table: "ChatMessages");

            migrationBuilder.RenameColumn(
                name: "ChatChannelId",
                table: "ChatMessages",
                newName: "ChannelId");

            migrationBuilder.RenameIndex(
                name: "IX_ChatMessages_ChatChannelId",
                table: "ChatMessages",
                newName: "IX_ChatMessages_ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMessages_ChatChannels_ChannelId",
                table: "ChatMessages",
                column: "ChannelId",
                principalTable: "ChatChannels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
