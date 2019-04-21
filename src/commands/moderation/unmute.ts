import { Command } from '../../command';
import { extractUserFrom } from '../../utils';

export default class UnmuteCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'unmute',
        description: 'Unmute a user',
        group: 'Moderation',
        usage: '<user>',
        guildOnly: true,
        requiredPermissions: ['MANAGE_ROLES'],
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    // Verify a valid member is passed
    const memberString = extractUserFrom(commandArgs[0]);

    if (!memberString) {
      await message.channel.send("You didn't specify anybody to mute!");
      return;
    }

    const memberToUnmute = message.guild.member(memberString);

    if (!memberToUnmute) {
      await message.channel.send("That user isn't in this server or does not exist!");
      return;
    }

    const mutedRole = message.guild.roles.find(role => role.name === 'Muted');
    if (!mutedRole) {
      await message.channel.send("Error! A 'Muted' role doesn't exist in this server");
      return;
    }

    if (!memberToUnmute.roles.has(mutedRole.id)) {
      await message.channel.send(`Error! ${memberToUnmute} is not muted!`);
      return;
    }

    // Unmute user and respond on Discord
    await memberToUnmute.removeRole(mutedRole);
    await message.channel.send(`${memberToUnmute} was unmuted!`);
  }
}
