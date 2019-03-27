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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
    execute: function (message, commandArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, memberToMute, mutedRole, _b, _c, _d, channel, e_1_1, err_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(commandArgs.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.channel.send('Nobody was specified to mute!')];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 22];
                    case 2:
                        memberToMute = message.mentions.members.first() || commandArgs[0];
                        if (!!memberToMute) return [3 /*break*/, 4];
                        return [4 /*yield*/, message.channel.send("Error! You didn't specify anybody to mute!")];
                    case 3:
                        _e.sent();
                        return [2 /*return*/];
                    case 4:
                        if (!memberToMute.hasPermission('MANAGE_MESSAGES')) return [3 /*break*/, 6];
                        return [4 /*yield*/, message.channel.send(memberToMute + " cannot be muted!")];
                    case 5:
                        _e.sent();
                        return [2 /*return*/];
                    case 6:
                        mutedRole = message.guild.roles.find(function (role) { return role.name === 'Muted'; });
                        if (!!mutedRole) return [3 /*break*/, 19];
                        _e.label = 7;
                    case 7:
                        _e.trys.push([7, 17, , 19]);
                        return [4 /*yield*/, message.guild.createRole({
                                name: 'Muted',
                                permissions: [],
                                color: '#808080',
                            })];
                    case 8:
                        mutedRole = _e.sent();
                        _e.label = 9;
                    case 9:
                        _e.trys.push([9, 14, 15, 16]);
                        _b = __values(message.guild.channels), _c = _b.next();
                        _e.label = 10;
                    case 10:
                        if (!!_c.done) return [3 /*break*/, 13];
                        _d = __read(_c.value, 2), channel = _d[1];
                        return [4 /*yield*/, channel.overwritePermissions(mutedRole, {
                                SEND_MESSAGES: false,
                                ADD_REACTIONS: false,
                            })];
                    case 11:
                        _e.sent();
                        _e.label = 12;
                    case 12:
                        _c = _b.next();
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 16];
                    case 14:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 15:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 16: return [3 /*break*/, 19];
                    case 17:
                        err_1 = _e.sent();
                        return [4 /*yield*/, message.channel.send("Unable to create a 'Muted' role!")];
                    case 18:
                        _e.sent();
                        return [2 /*return*/];
                    case 19: return [4 /*yield*/, memberToMute.addRole(mutedRole)];
                    case 20:
                        _e.sent();
                        return [4 /*yield*/, message.channel.send(memberToMute + " was muted!")];
                    case 21:
                        _e.sent();
                        _e.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    },
};
//# sourceMappingURL=mute.js.map