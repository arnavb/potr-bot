from discord.ext import commands


class General(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command()
    async def hello(self, ctx, *names: str):
        """Say hello to someone!"""
        await ctx.send(f"Hello, {' '.join(names)}!")


def setup(bot: commands.Bot):
    bot.add_cog(General(bot))
