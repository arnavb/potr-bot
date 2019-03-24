module.exports = {
  name: 'hello',
  description: 'Say hello to someone!',
  group: 'General',
  usage: '[arg...]',

  /**
   * @param {import("discord.js").Message} message
   * @param {Array<string>} commandArgs
   */
  async execute(message, commandArgs) {
    if (commandArgs.length === 0) {
      await message.channel.send(`Hello, ${message.author.username}!`);
    } else {
      await message.channel.send(`Hello, ${commandArgs.join(' ')}!`);
    }
  },
};
