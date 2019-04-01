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

  const userToBan = await message.client.fetchUser(memberString);

  if (!userToBan) {
    await message.channel.send('That user does not exist!');
    return;
  }

  let reason = 'no reason';

  if (commandArgs.length > 1) {
    reason = commandArgs.slice(1).join(' ');
  }

  await message.guild.ban(userToBan, reason);
  await message.channel.send(`Successfully banned ${userToBan} for ${reason}`);
  userToBan.send(`Hey! You were banned from ${message.guild.name} for ${reason}`);
}
