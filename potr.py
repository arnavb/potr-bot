from discord.ext import commands
import os
from typing import List


# pylint:disable=invalid-name
bot = commands.Bot(command_prefix=">>", description="A protector of the realm")

COGS = ["cogs.general"]


@bot.event
async def on_ready():
    print(f"Logging in as {bot.user.name}#{bot.user.discriminator}")


def main(discord_bot_token: str):
    for cog in COGS:
        bot.load_extension(cog)

    bot.run(discord_bot_token)


if __name__ == "__main__":
    main(os.environ["DISCORD_BOT_TOKEN"])
