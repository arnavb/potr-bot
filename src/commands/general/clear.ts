import { Command } from '../../command';

export default class ClearCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'clear',
        description: 'Clear a specified number of messages',
        group: 'General',
        usage: '[number]',
        guildOnly: true,
        requiredPermissions: ['MANAGE_MESSAGES'],
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    const numberOfMessages = parseInt(commandArgs[0], 10);

    if (isNaN(numberOfMessages)) {
      await message.channel.send(`${commandArgs[0]} is not a valid number!`);
      return;
    }

    await message.channel.bulkDelete(numberOfMessages);
  }
}
