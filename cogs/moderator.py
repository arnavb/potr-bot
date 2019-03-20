from typing import Optional

import discord
from discord.ext import commands


def can_mute():
    async def predicate(ctx):
        permissions = ctx.author.permissions_in(ctx.channel)
        return permissions.mute_members or permissions.administrator

    return commands.check(predicate)


class Moderator(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    @can_mute()
    async def mute(
        self, ctx, member: Optional[discord.Member] = None, reason: Optional[str] = None
    ):
        """Mute a user"""

        if member is None:
            await ctx.send("Nobody was specified to mute!")
            return

        if ctx.author == member:
            await ctx.send("You want to mute yourself? Uhhhhhhhhh")
            return

        await member.add_roles("Muted", reason)

        await ctx.send(f"Muted user {member.name} for {reason}.")

    @commands.command()
    @can_mute()
    async def unmute(self, ctx, member: Optional[discord.Member] = None):
        """Unmute a user"""

        if member is None:
            await ctx.send("Nobody was specified to unmute!")
            return

        if ctx.author == member:
            await ctx.send("Wait. If you're muted, then how did you run this command?")
            return

        await member.remove_roles("Muted")

        await ctx.send(f"Unmuted user {member.name}.")

    async def cog_command_error(self, ctx, error):
        if isinstance(error, commands.CheckFailure):
            await ctx.send(f"Sorry! You lack permissions to run this command!")


def setup(bot: commands.Bot):
    bot.add_cog(Moderator(bot))
