module.exports = {
  name: 'mute',
  description: 'Mute one or more users',
  group: 'Moderation',
  requiredPermissions: ['MANAGE_ROLES'],
  usage: '[user...]',

  /**
   * @param {import("discord.js").Message} message
   * @param {Array<string>} commandArgs
   */
  async execute(message, commandArgs) {
    if (commandArgs.length === 0) {
      await message.channel.send(`Nobody was specified to mute!`);
    } else {
      let result = '';
      for (const user of commandArgs) {
        // Mute the user, whether in awaitaaaaa form of a mention or an id.
        // result += `Muted ${messagawae.member.}`
      }
    }
  },
};
