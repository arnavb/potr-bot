from discord.ext import commands


class Moderator(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    async def mute(self, ctx):
        await ctx.send("Can't do it yet")


def setup(bot: commands.Bot):
    bot.add_cog(Moderator(bot))
