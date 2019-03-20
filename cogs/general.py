from typing import Optional

import discord
from discord.ext import commands


class General(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    async def hello(self, ctx, *names: str):
        """Say hello to someone!"""
        await ctx.send(f"Hello, {' '.join(names)}!")

    @commands.command(aliases=["commands"], description="Help")
    async def help(self, ctx, command: Optional[str] = None):

        help_embed = discord.Embed(title="Help", color=0x009700)
        help_embed.set_thumbnail(url=self.bot.user.avatar_url)
        cogs = self.bot.cogs.keys()

        if command is None:
            for cog in cogs:
                cog_commands = self.bot.get_cog(cog).get_commands()
                commands_list = "\n".join(
                    f"{c.name} - {c.description}" for c in cog_commands
                )

                print(commands_list)

                help_embed.add_field(name=cog, value="Bob", inline=False)

        await ctx.send(embed=help_embed)


def setup(bot: commands.Bot):
    bot.add_cog(General(bot))
