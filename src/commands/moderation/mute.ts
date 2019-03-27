export const name = 'mute';
export const description = 'Mute one or more users';
export const usage = '<user>';
export const group = 'Moderation';
export const requiredPermissions = ['MANAGE_ROLES'];
export const guildOnly = true;

export async function execute(
  message: import('discord.js').Message,
  commandArgs: string[],
) {
  if (commandArgs.length === 0) {
    await message.channel.send('Nobody was specified to mute!');
  } else {
    const memberToMute = message.mentions.members.first() || commandArgs[0];
    if (!memberToMute) {
      await message.channel.send("Error! You didn't specify anybody to mute!");
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
          color: '#808080',
          name: 'Muted',
          permissions: [],
        });
        // eslint-disable-next-line no-unused-vars
        for (const [, channel] of message.guild.channels) {
          await channel.overwritePermissions(mutedRole, {
            ADD_REACTIONS: false,
            SEND_MESSAGES: false,
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
}
