import { Command } from '../../command';

export default class UrlCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'url',
        description: 'Get the authorization URL for this bot',
        group: 'General',
        guildOnly: false,
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, _: string[]) {
    await message.channel.send(
      'https://discordapp.com/oauth2/authorize?&client_id=557603685254037504&scope=bot&permissions=8',
    );
  }
}
