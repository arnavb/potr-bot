import { extractIDFromMention } from '../../utils';

export const name = 'unban';
export const description = 'Unban a user';
export const usage = '<user>';
export const group = 'Moderation';
export const requiredPermissions = ['BAN_MEMBERS'];
export const guildOnly = true;

export async function execute(message: import('discord.js').Message, commandArgs: string[]) {
  // Verify a valid member is passed
  const memberString = extractIDFromMention(commandArgs[0]);

  if (!memberString) {
    await message.channel.send("You didn't specify anybody to unban!");
    return;
  }

  await message.guild.unban(memberString);
  await message.channel.send(`Successfully unbanned!`);
}
