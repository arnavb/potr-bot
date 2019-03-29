export const name = 'ban';
export const description = 'Ban a user';
export const usage = '<user> [reason]';
export const group = 'Moderation';
export const requiredPermissions = ['BAN_MEMBERS'];
export const guildOnly = true;

export async function execute(message: import('discord.js').Message, commandArgs: string[]) {
  if (commandArgs.length === 0) {
    await message.channel.send('Nobody was specified to mute!');
  } else {
    const userToBan = message.mentions.members.first() || message.guild.member(commandArgs[0]);

    if (!userToBan) {
      await message.channel.send("You didn't specify anybody to ban!");
      return;
    }

    const memberToBan = message.guild.member(userToBan);

    if (!memberToBan) {
      await message.channel.send("That user isn't in this server!");
      return;
    }

    let reason = 'no reason';

    if (commandArgs.length > 1) {
      reason = commandArgs.slice(1).join(' ');
    }

    try {
      await memberToBan.ban(reason);
    } catch (err) {
      await message.channel.send(`Unable to ban user ${memberToBan}`);
      return;
    }

    await message.channel.send(`Successfully banned ${memberToBan} for ${reason}`);
  }
}
