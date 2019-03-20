from typing import Optional

import discord
from discord.ext import commands


# Neon Green-ish
HELP_EMBED_COLOR = 0x009700


class General(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    async def hello(self, ctx, *names: str):
        """Say hello to someone (or something)!"""
        await ctx.send(f"Hello, {' '.join(names)}!")

    @commands.command(aliases=["commands"])
    async def help(self, ctx, help_for: Optional[str] = None):
        """Get help for one or more commands"""

        help_embed = discord.Embed(title="Help", color=0x009700)
        help_embed.set_thumbnail(url=self.bot.user.avatar_url)

        cogs = self.bot.cogs.keys()

        if help_for is None:
            for cog in cogs:
                cog_commands = self.bot.get_cog(cog).get_commands()

                commands_list = "\n".join(
                    f"**{command.name}** - {command.short_doc}" for command in cog_commands
                )

                help_embed.add_field(name=cog, value=commands_list, inline=False)

        await ctx.send(embed=help_embed)


def setup(bot: commands.Bot):
    bot.add_cog(General(bot))
