module.exports = {
  name: 'mute',
  description: 'Mute one or more users',
  usage: '<user>',
  group: 'Moderation',
  requiredPermissions: ['MANAGE_ROLES'],
  guildOnly: true,

  /**
   * @param {import("discord.js").Message} message
   * @param {Array<string>} commandArgs
   */
  async execute(message, commandArgs) {
    if (commandArgs.length === 0) {
      await message.channel.send('Nobody was specified to mute!');
    } else {
      let memberToMute = message.mentions.members.first() || commandArgs[0];
      if (!memberToMute) {
        await message.channel.send(
          "Error! You didn't specify anybody to mute!",
        );
        return;
      }

      if (memberToMute.hasPermission('MANAGE_MESSAGES')) {
        await message.channel.send(`${memberToMute} cannot be muted!`);
        return;
      }
      let mutedRole = message.guild.roles.find(role => role.name === 'Muted');

      // Create muted role if it doesn't exist already
      if (!mutedRole) {
        try {
          mutedRole = await message.guild.createRole({
            name: 'Muted',
            permissions: [],
            color: '#808080',
          });

          // eslint-disable-next-line no-unused-vars
          for (const [, channel] of message.guild.channels) {
            await channel.overwritePermissions(mutedRole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
            });
          }
        } catch (err) {
          await message.channel.send("Unable to create a 'Muted' role!");
          return;
        }
      }

      await memberToMute.addRole(mutedRole);
      await message.channel.send(`${memberToMute} was muted!`);
    }
  },
};
