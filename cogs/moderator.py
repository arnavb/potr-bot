from typing import Optional

import discord
from discord.ext import commands


class Moderator(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    @commands.has_permissions(manage_roles=True)
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

        muted_role = discord.utils.get(ctx.guild.roles, name="Muted")

        if muted_role in member.roles:
            await ctx.send(f"{member.name} is already muted!")
            return

        await member.add_roles(muted_role, reason=reason)

        output = f"Muted user {member.name}"
        if reason is not None:
            output += f" for {reason}"

        await ctx.send(output)

    @commands.command()
    @commands.has_permissions(manage_roles=True)
    async def unmute(self, ctx, member: Optional[discord.Member] = None):
        """Unmute a user"""

        if member is None:
            await ctx.send("Nobody was specified to unmute!")
            return

        if ctx.author == member:
            await ctx.send("Wait. If you're muted, then how did you run this command?")
            return

        muted_role = discord.utils.get(ctx.guild.roles, name="Muted")

        if muted_role not in member.roles:
            await ctx.send(f"{member.name} is not muted!")
            return

        await member.remove_roles(muted_role)

        await ctx.send(f"Unmuted user {member.name}.")

    async def cog_command_error(self, ctx, error):
        # TODO: More robust error handling
        if isinstance(error, commands.CheckFailure):
            await ctx.send(
                "Sorry! You lack permissions to run this command!\n(Or the command doesn't make any sense)"
            )


def setup(bot: commands.Bot):
    bot.add_cog(Moderator(bot))
