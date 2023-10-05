using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TV_IDP.Migrations
{
    /// <inheritdoc />
    public partial class UpdateChessGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Completed",
                table: "ChessGames",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TurnUserId",
                table: "ChessGames",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WinnerUserId",
                table: "ChessGames",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Completed",
                table: "ChessGames");

            migrationBuilder.DropColumn(
                name: "TurnUserId",
                table: "ChessGames");

            migrationBuilder.DropColumn(
                name: "WinnerUserId",
                table: "ChessGames");
        }
    }
}
