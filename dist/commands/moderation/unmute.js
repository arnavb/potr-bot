"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
module.exports = {
    name: 'unmute',
    description: 'Unmute one or more users',
    usage: '<user>',
    group: 'Moderation',
    requiredPermissions: ['MANAGE_ROLES'],
    guildOnly: true,
    /**
     * @param {import("discord.js").Message} message
     * @param {Array<string>} commandArgs
     */
    execute: function (message, commandArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var memberToUnmute, mutedRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(commandArgs.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.channel.send('Nobody was specified to unmute!')];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 2:
                        memberToUnmute = message.mentions.members.first() || commandArgs[0];
                        if (!!memberToUnmute) return [3 /*break*/, 4];
                        return [4 /*yield*/, message.channel.send("Error! You didn't specify anybody to unmute!")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                    case 4:
                        mutedRole = message.guild.roles.find(function (role) { return role.name === 'Muted'; });
                        if (!!mutedRole) return [3 /*break*/, 6];
                        return [4 /*yield*/, message.channel.send("Error! A 'Muted' role doesn't exist in this server")];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                    case 6:
                        if (!!memberToUnmute.roles.has(mutedRole.id)) return [3 /*break*/, 8];
                        return [4 /*yield*/, message.channel.send("Error! " + memberToUnmute + " is not muted!")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                    case 8: return [4 /*yield*/, memberToUnmute.removeRole(mutedRole)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, message.channel.send(memberToUnmute + " was unmuted!")];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
};
//# sourceMappingURL=unmute.js.map