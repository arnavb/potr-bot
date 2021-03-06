import { Command } from '../../command';
import { extractUserFrom } from '../../utils';

export default class BanCommand extends Command {
  constructor(db: import('../../bot-db').BotDb) {
    super(
      {
        name: 'ban',
        description: 'Ban a user',
        group: 'Moderation',
        usage: '<user> [reason]',
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
      await message.channel.send("You didn't specify anybody to ban!");
      return;
    }

    const userToBan = await message.client.users.fetch(memberString);

    if (!userToBan) {
      await message.channel.send('That user does not exist!');
      return;
    }

    let reason = 'no reason';

    if (commandArgs.length > 1) {
      reason = commandArgs.slice(1).join(' ');
    }

    await message.guild!.members.ban(userToBan, { reason });
    await message.channel.send(`Successfully banned ${userToBan} for ${reason}`);
    userToBan.send(`Hey! You were banned from ${message.guild!.name} for ${reason}`);
  }
}
