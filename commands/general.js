module.exports = [
  {
    name: 'hello',
    description: 'Say hello to someone!',
    category: 'General',
    usage: '[args]',

    /**
     * @param {import("discord.js").Message} message
     * @param {Array<string>} commandArgs
     */
    async run(message, commandArgs) {
      if (commandArgs.length === 0) {
        await message.channel.send(`Hello, ${message.author.username}!`);
      } else {
        await message.channel.send(`Hello, ${commandArgs.join()}!`);
      }
    },
  },
];
