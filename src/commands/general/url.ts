export const name = 'url';
export const description = 'Get the authorization URL for this bot';
export const group = 'General';

export async function execute(message: import('discord.js').Message, _: string[]) {
  await message.channel.send(
    'https://discordapp.com/oauth2/authorize?&client_id=557603685254037504&scope=bot&permissions=8',
  );
}
