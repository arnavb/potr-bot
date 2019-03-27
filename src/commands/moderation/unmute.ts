export const name = 'unmute';
export const description = 'Unmute one or more users';
export const usage = '<user>';
export const group = 'Moderation';
export const requiredPermissions = ['MANAGE_ROLES'];
export const guildOnly = true;

    export async function execute(message: import("discord.js").Message, commandArgs: string[]) {
    if (commandArgs.length === 0) {
        await message.channel.send('Nobody was specified to unmute!');
    }
    else {
        let memberToUnmute = message.mentions.members.first() || commandArgs[0];
        if (!memberToUnmute) {
            await message.channel.send("Error! You didn't specify anybody to unmute!");
            return;
        }
        let mutedRole = message.guild.roles.find(role => role.name === 'Muted');
        if (!mutedRole) {
            await message.channel.send("Error! A 'Muted' role doesn't exist in this server");
            return;
        }
        if (!memberToUnmute.roles.has(mutedRole.id)) {
            await message.channel.send(`Error! ${memberToUnmute} is not muted!`);
            return;
        }
        await memberToUnmute.removeRole(mutedRole);
        await message.channel.send(`${memberToUnmute} was unmuted!`);
    }
}
