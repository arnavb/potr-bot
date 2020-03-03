import ms from 'ms';
import { Command } from '../../command';
import { extractUserFrom } from '../../utils';

export default class MuteCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'mute',
        description: 'Mute a user for an optional period of time',
        group: 'Moderation',
        usage: '<user> [time]',
        guildOnly: true,
        requiredPermissions: ['MANAGE_ROLES'],
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    // Verify at least one user is passed
    const memberString = extractUserFrom(commandArgs[0]);

    if (!memberString) {
      await message.channel.send("You didn't specify anybody to mute!");
      return;
    }

    const memberToMute = message.guild!.member(memberString);

    if (!memberToMute) {
      await message.channel.send("That user isn't in this server or does not exist!");
      return;
    }

    // Make sure the person being muted CAN be muted
    if (memberToMute.hasPermission('MANAGE_MESSAGES')) {
      await message.channel.send(`${memberToMute} cannot be muted!`);
      return;
    }

    let mutedRole = message.guild!.roles.cache.find(role => role.name === 'Muted');

    // Create muted role if it doesn't exist already
    if (!mutedRole) {
      try {
        mutedRole = await message.guild!.roles.create({
          data: { color: '#808080', name: 'Muted', permissions: [] },
        });

        for (const [, channel] of message.guild!.channels.cache) {
          await channel.overwritePermissions([
            { id: mutedRole, deny: ['ADD_REACTIONS', 'SEND_MESSAGES'] },
          ]);
        }
      } catch (err) {
        await message.channel.send("Unable to create a 'Muted' role!");
        return;
      }
    }

    if (memberToMute.roles.cache.has(mutedRole.id)) {
      await message.channel.send(`${memberToMute} is already muted!`);
      return;
    }

    // Mute user and respond on Discord
    await memberToMute.roles.add(mutedRole);

    // If a time period is specified, do a tempmute
    if (commandArgs.length > 1) {
      const timePeriod = commandArgs[1];

      await message.channel.send(
        `${memberToMute} was muted for ${ms(ms(timePeriod), { long: true })}!`,
      );
      setTimeout(async () => {
        await memberToMute.roles.remove(mutedRole!);
        await message.channel.send(
          `${memberToMute} was unmuted after ${ms(ms(timePeriod), { long: true })}!`,
        );
      }, ms(timePeriod));
    } else {
      await message.channel.send(`${memberToMute} was muted!`);
    }
  }
}
