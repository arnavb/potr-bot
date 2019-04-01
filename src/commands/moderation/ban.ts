import { extractIDFromMention } from '../../utils';

export const name = 'ban';
export const description = 'Ban a user';
export const usage = '<user> [reason]';
export const group = 'Moderation';
export const requiredPermissions = ['BAN_MEMBERS'];
export const guildOnly = true;

export async function execute(message: import('discord.js').Message, commandArgs: string[]) {
  // Verify a valid member is passed
  const memberString = extractIDFromMention(commandArgs[0]);

  if (!memberString) {
    await message.channel.send("You didn't specify anybody to ban!");
    return;
  }

  let reason = 'no reason';

  if (commandArgs.length > 1) {
    reason = commandArgs.slice(1).join(' ');
  }

  await message.guild.ban(memberString, reason);
  await message.channel.send(`Successfully banned for ${reason}!`);
  // TODO: Figure out a way to get this to work --v
  // memberToBan.send(`Hey! You were banned from ${message.guild.name} for ${reason}`);
}
