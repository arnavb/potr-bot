import { Command } from '../../command';
import { extractUserFrom } from '../../utils';

export default class WarnCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'warn',
        description: 'Warn a user for an infraction',
        group: 'Moderation',
        guildOnly: true,
      },
      db,
    );
  }
  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    const memberString = extractUserFrom(commandArgs[0]);

    if (!memberString) {
      await message.channel.send("You didn't specify anybody to warn!");
      return;
    }

    const memberToWarn = message.guild!.member(memberString);

    if (!memberToWarn) {
      await message.channel.send("That user isn't in this server or does not exist!");
      return;
    }

    if (memberToWarn.hasPermission('MANAGE_MESSAGES')) {
      await message.channel.send(`${memberToWarn} cannot be warned!`);
      return;
    }

    if (commandArgs.length <= 1) {
      // No reason specified
      await message.channel.send(`You didn't specify a reason to warn ${memberToWarn}!`);
      return;
    }

    const reason = commandArgs.slice(1).join(' ');

    await this.db.addUserInfraction(message.guild!.id, message.author.id, `Warned for ${reason}`);
    await message.channel.send(`${memberToWarn} was warned for ${reason}`);
  }
}
