"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
require('dotenv').config();
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const readdir = util_1.promisify(fs_1.default.readdir);
function loadAllCommands(commandsDir, commandGroups) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new discord_js_1.default.Collection();
        // For all directories in `commandGroups` (with `commandsDir` as root),
        // store all commands in `result`.
        for (const group of commandGroups) {
            try {
                const commandFiles = yield readdir(`${__dirname}/${commandsDir}/${group}`);
                for (const file of commandFiles) {
                    const command = require(`${__dirname}/${commandsDir}/${group}/${file}`);
                    result.set(command.name, command);
                }
            }
            catch (err) {
                console.error(`Unable to load group ${group}. Error: ${err}`);
            }
        }
        return result;
    });
}
const client = new discord_js_1.default.Client();
let commands;
const prefix = '>>';
client.once('ready', () => __awaiter(this, void 0, void 0, function* () {
    console.log(`Logging in with ${client.user.username}#${client.user.discriminator}`);
    try {
        commands = yield loadAllCommands('commands', [
            'general',
            'moderation',
        ]);
    }
    catch (err) {
        console.error(`Unable to load groups. Error: ${err}`);
    }
}));
client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
    // If command is not of valid format or is written by a bot, return
    if (!message.content.startsWith(prefix) ||
        message.author.bot ||
        message.content.trim().length === prefix.length) {
        return;
    }
    const commandArgs = message.content.slice(prefix.length).split(/ +/);
    const commandName = commandArgs.shift() || "";
    // Try to get command by primary name, otherwise check aliases
    const command = commands.get(commandName) ||
        commands.find((command) => command.hasOwnProperty("aliases") && command.aliases.includes(commandName));
    // If command/aliases not found, return
    if (!command) {
        return;
    }
    // Filter guild-only commands
    if (command.guildOnly && message.channel.type !== 'text') {
        yield message.channel.send(`Error! I can't use that command in DMs!`);
        return;
    }
    // Check if user has required permissions to run the command
    if (command.requiredPermissions &&
        !message.member.hasPermission(command.requiredPermissions)) {
        yield message.channel.send("Error! You don't have permissions to run this command!");
    }
    try {
        yield command.execute(message, commandArgs);
    }
    catch (err) {
        // TODO: Better error handling
        console.error(`An error occurred! ${err}`);
    }
}));
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=index.js.map