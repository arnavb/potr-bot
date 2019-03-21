import os

from discord.ext import commands


# pylint:disable=invalid-name
bot = commands.Bot(command_prefix=">>", description="A protector of the realm")

INITIAL_COGS = ["cogs.general", "cogs.moderator"]


@bot.event
async def on_ready():
    print(f"Logging in as {bot.user.name}#{bot.user.discriminator}")

def main():
    bot.remove_command("help")

    for cog in INITIAL_COGS:
        bot.load_extension(cog)

    bot.run(os.environ["DISCORD_BOT_TOKEN"])

if __name__ == "__main__":
    main()
