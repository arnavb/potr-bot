"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'unmute';
exports.description = 'Unmute one or more users';
exports.usage = '<user>';
exports.group = 'Moderation';
exports.requiredPermissions = ['MANAGE_ROLES'];
exports.guildOnly = true;
function execute(message, commandArgs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commandArgs.length === 0) {
            yield message.channel.send('Nobody was specified to unmute!');
        }
        else {
            let memberToUnmute = message.mentions.members.first() || commandArgs[0];
            if (!memberToUnmute) {
                yield message.channel.send("Error! You didn't specify anybody to unmute!");
                return;
            }
            let mutedRole = message.guild.roles.find(role => role.name === 'Muted');
            if (!mutedRole) {
                yield message.channel.send("Error! A 'Muted' role doesn't exist in this server");
                return;
            }
            if (!memberToUnmute.roles.has(mutedRole.id)) {
                yield message.channel.send(`Error! ${memberToUnmute} is not muted!`);
                return;
            }
            yield memberToUnmute.removeRole(mutedRole);
            yield message.channel.send(`${memberToUnmute} was unmuted!`);
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=unmute.js.map