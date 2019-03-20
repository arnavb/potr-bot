from discord.ext import commands
import os
from typing import List


# pylint:disable=invalid-name
bot = commands.Bot(command_prefix="!", description="A protector of the realm")


@bot.event
async def on_ready():
    print("Logging in!")


@bot.command()
async def hello(ctx, *names):
    """Say hello to someone!"""
    await ctx.send(f"Hello, {' '.join(names)}!")


def main(discord_bot_token: str):
    bot.run(discord_bot_token)


if __name__ == "__main__":
    main(os.environ["DISCORD_BOT_TOKEN"])
