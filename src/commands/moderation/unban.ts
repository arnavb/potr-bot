import { Command } from '../../command';
import { extractUserFrom } from '../../utils';

export default class UnbanCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'ubban',
        description: 'Unban a user',
        group: 'Moderation',
        usage: '<user>',
        guildOnly: true,
        requiredPermissions: ['BAN_MEMBERS'],
      },
      db,
    );
  }

  public async execute(message: import('discord.js').Message, commandArgs: string[]) {
    // Verify a valid member is passed
    const memberString = extractUserFrom(commandArgs[0]);

    if (!memberString) {
      await message.channel.send("You didn't specify anybody to unban!");
      return;
    }

    const userToUnban = await message.client.fetchUser(memberString);

    if (!userToUnban) {
      await message.channel.send('That user does not exist!');
      return;
    }

    await message.guild.unban(userToUnban);
    await message.channel.send(`Successfully unbanned ${userToUnban}`);
  }
}
