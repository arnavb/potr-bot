import ms from 'ms';
import { extractIDFromMention } from '../../utils';

export const name = 'mute';
export const description = 'Mute a user for an optional period of time';
export const usage = '<user> [time]';
export const group = 'Moderation';
export const requiredPermissions = ['MANAGE_ROLES'];
export const guildOnly = true;

export async function execute(message: import('discord.js').Message, commandArgs: string[]) {
  // Verify at least one user is passed
  const memberString = extractIDFromMention(commandArgs[0]);

  if (!memberString) {
    await message.channel.send("You didn't specify anybody to mute!");
    return;
  }

  const memberToMute = message.guild.member(memberString!);

  if (!memberToMute) {
    await message.channel.send("That user isn't in this server or does not exist!");
    return;
  }

  // Make sure the person being muted CAN be muted
  if (memberToMute.hasPermission('MANAGE_MESSAGES')) {
    await message.channel.send(`${memberToMute} cannot be muted!`);
    return;
  }

  let mutedRole = message.guild.roles.find(role => role.name === 'Muted');

  // Create muted role if it doesn't exist already
  if (!mutedRole) {
    try {
      mutedRole = await message.guild.createRole({
        color: '#808080',
        name: 'Muted',
        permissions: [],
      });

      for (const [, channel] of message.guild.channels) {
        await channel.overwritePermissions(mutedRole, {
          ADD_REACTIONS: false,
          SEND_MESSAGES: false,
        });
      }
    } catch (err) {
      await message.channel.send("Unable to create a 'Muted' role!");
      return;
    }
  }

  if (memberToMute.roles.has(mutedRole.id)) {
    await message.channel.send(`${memberToMute} is already muted!`);
    return;
  }

  // Mute user and respond on Discord
  await memberToMute.addRole(mutedRole);

  // If a time period is specified, do a tempmute
  if (commandArgs.length > 1) {
    const timePeriod = commandArgs[1];

    await message.channel.send(
      `${memberToMute} was muted for ${ms(ms(timePeriod), { long: true })}!`,
    );
    setTimeout(async () => {
      await memberToMute.removeRole(mutedRole);
      await message.channel.send(
        `${memberToMute} was unmuted after ${ms(ms(timePeriod), { long: true })}!`,
      );
    }, ms(timePeriod));
  } else {
    await message.channel.send(`${memberToMute} was muted!`);
  }
}
