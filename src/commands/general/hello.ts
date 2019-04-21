import { Command } from '../../command';

export default class HelloCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'hello',
        description: 'Say hello to someone!',
        group: 'General',
        usage: '[arg...]',
        guildOnly: false,
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    if (commandArgs.length === 0) {
      await message.channel.send(`Hello, ${message.author.username}!`);
    } else {
      await message.channel.send(`Hello, ${commandArgs.join(' ')}!`);
    }
  }
}
