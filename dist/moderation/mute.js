var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const name = 'mute';
export const description = 'Mute one or more users';
export const usage = '<user>';
export const group = 'Moderation';
export const requiredPermissions = ['MANAGE_ROLES'];
export const guildOnly = true;
/**
 * @param {import("discord.js").Message} message
 * @param {Array<string>} commandArgs
 */
export function execute(message, commandArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commandArgs.length === 0) {
            yield message.channel.send('Nobody was specified to mute!');
        }
        else {
            let memberToMute = message.mentions.members.first() || commandArgs[0];
            if (!memberToMute) {
                yield message.channel.send("Error! You didn't specify anybody to mute!");
                return;
            }
            if (memberToMute.hasPermission('MANAGE_MESSAGES')) {
                yield message.channel.send(`${memberToMute} cannot be muted!`);
                return;
            }
            let mutedRole = message.guild.roles.find(role => role.name === 'Muted');
            // Create muted role if it doesn't exist already
            if (!mutedRole) {
                try {
                    mutedRole = yield message.guild.createRole({
                        name: 'Muted',
                        permissions: [],
                        color: '#808080',
                    });
                    // eslint-disable-next-line no-unused-vars
                    for (const [, channel] of message.guild.channels) {
                        yield channel.overwritePermissions(mutedRole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false,
                        });
                    }
                }
                catch (err) {
                    yield message.channel.send("Unable to create a 'Muted' role!");
                    return;
                }
            }
            yield memberToMute.addRole(mutedRole);
            yield message.channel.send(`${memberToMute} was muted!`);
        }
    });
}
//# sourceMappingURL=mute.js.map