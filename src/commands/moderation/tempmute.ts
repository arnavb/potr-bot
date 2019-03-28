import ms from 'ms';

export const name = 'tempmute';
export const description = 'Mute a user for a specified amount of time';
export const usage = '<user> <time>';
export const group = 'Moderation';
export const requiredPermissions = ['MANAGE_ROLES'];
export const aliases = ['tm'];
export const guildOnly = true;

export async function execute(message: import('discord.js').Message, commandArgs: string[]) {
  if (commandArgs.length === 0) {
    await message.channel.send('Nobody was specified to mute!');
  } else {
    // Verify at least one user is passed
    const memberToMute = message.mentions.members.first() || commandArgs[0];
    if (!memberToMute) {
      await message.channel.send("Error! You didn't specify anybody to mute!");
      return;
    }

    const timeToMute = commandArgs[1];

    if (!timeToMute) {
      await message.channel.send("You didn't specify a time period!");
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

    // Mute user and respond on Discord
    await memberToMute.addRole(mutedRole);
    await message.channel.send(
      `${memberToMute} was muted for ${ms(ms(timeToMute), { long: true })}!`,
    );

    setTimeout(async () => {
      await memberToMute.removeRole(mutedRole);
      await message.channel.send(
        `${memberToMute} was unmuted after ${ms(ms(timeToMute), { long: true })}!`,
      );
    }, ms(timeToMute));
  }
}
