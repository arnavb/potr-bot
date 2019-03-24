module.exports = {
  name: 'unmute',
  description: 'Unmute one or more users',
  group: 'Moderation',
  requiredPermissions: ['MANAGE_ROLES'],
  usage: '[user...]',

  /**
   * @param {import("discord.js").Message} message
   * @param {Array<string>} commandArgs
   */
  async execute(message, commandArgs) {
    if (commandArgs.length === 0) {
      await message.channel.send(`Hello, ${message.author.username}!`);
    } else {
      await message.channel.send(`Hello, ${commandArgs.join()}!`);
    }
  },
};
