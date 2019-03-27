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
var _this = this;
var Discord = require('discord.js');
require('dotenv').config();
var fs = require('fs');
var promisify = require('util').promisify;
var readdir = promisify(fs.readdir);
/**
 * @callback executeCallback
 * @param {Discord.Message} responseCode
 * @param {Array<string>} responseMessage
 */
/**
 * Object representing a Discord command
 * @typedef {Object} Command
 * @property {string} name Name of the command
 * @property {string} description Description of the command
 * @property {string} [usage] Usage string of the command
 * @property {string} group Command category to group this command with
 * @property {Array<string>} [requiredPermissions] Permissions this command requires to execute
 * @property {boolean} [guildOnly] Whether this command can be executed outside of guilds
 * @property {Array<string>} [aliases] Any aliases this command has
 * @property {executeCallback} execute The callback to execute the command
 */
/**
 * @param {string} commandsDir
 * @param {Array<string>} commandGroups
 */
function loadAllCommands(commandsDir, commandGroups) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, _a, e_2, _b, result, commandGroups_1, commandGroups_1_1, group, commandFiles, commandFiles_1, commandFiles_1_1, file, command, err_1, e_1_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    result = new Discord.Collection();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, 9, 10]);
                    commandGroups_1 = __values(commandGroups), commandGroups_1_1 = commandGroups_1.next();
                    _c.label = 2;
                case 2:
                    if (!!commandGroups_1_1.done) return [3 /*break*/, 7];
                    group = commandGroups_1_1.value;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, readdir(__dirname + "/" + commandsDir + "/" + group)];
                case 4:
                    commandFiles = _c.sent();
                    try {
                        for (commandFiles_1 = __values(commandFiles), commandFiles_1_1 = commandFiles_1.next(); !commandFiles_1_1.done; commandFiles_1_1 = commandFiles_1.next()) {
                            file = commandFiles_1_1.value;
                            command = require(__dirname + "/" + commandsDir + "/" + group + "/" + file);
                            result.set(command.name, command);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (commandFiles_1_1 && !commandFiles_1_1.done && (_b = commandFiles_1.return)) _b.call(commandFiles_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    console.error("Unable to load group " + group + ". Error: " + err_1);
                    return [3 /*break*/, 6];
                case 6:
                    commandGroups_1_1 = commandGroups_1.next();
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (commandGroups_1_1 && !commandGroups_1_1.done && (_a = commandGroups_1.return)) _a.call(commandGroups_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/, result];
            }
        });
    });
}
var client = new Discord.Client();
/** @type {Discord.Collection<string, Command>} */
var commands;
var prefix = '>>';
client.once('ready', function () { return __awaiter(_this, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Logging in with " + client.user.username + "#" + client.user.discriminator);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, loadAllCommands('commands', [
                        'general',
                        'moderation',
                    ])];
            case 2:
                commands = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.error("Unable to load groups. Error: " + err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
client.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
    var commandArgs, commandName, command, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // If command is not of valid format or is written by a bot, return
                if (!message.content.startsWith(prefix) ||
                    message.author.bot ||
                    message.content.trim().length === prefix.length) {
                    return [2 /*return*/];
                }
                commandArgs = message.content.slice(prefix.length).split(/ +/);
                commandName = commandArgs.shift() || "";
                command = commands.get(commandName) ||
                    commands.find(function (command) { return command.aliases && command.aliases.includes(commandName); });
                // If command/aliases not found, return
                if (!command) {
                    return [2 /*return*/];
                }
                if (!(command.guildOnly && message.channel.type !== 'text')) return [3 /*break*/, 2];
                return [4 /*yield*/, message.channel.send("Error! I can't use that command in DMs!")];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                if (!(command.requiredPermissions &&
                    !message.member.hasPermission(command.requiredPermissions))) return [3 /*break*/, 4];
                return [4 /*yield*/, message.channel.send("Error! You don't have permissions to run this command!")];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, command.execute(message, commandArgs)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                // TODO: Better error handling
                console.error("An error occurred! " + err_3);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=index.js.map