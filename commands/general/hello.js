class HelloCommand {
  constructor() {
    this.name = 'hello';
    this.description = 'Say hello to someone!';
    this.usage = '[string]';
  }

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
  }
}

module.exports = HelloCommand;
