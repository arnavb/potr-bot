export const name = 'hello';
export const description = 'Say hello to someone!';
export const group = 'General';
export const usage = '[arg...]';
export async function execute(
  message: import('discord.js').Message,
  commandArgs: string[],
) {
  if (commandArgs.length === 0) {
    await message.channel.send(`Hello, ${message.author.username}!`);
  } else {
    await message.channel.send(`Hello, ${commandArgs.join(' ')}!`);
  }
}
