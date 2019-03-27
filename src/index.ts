import Discord from 'discord.js';
require('dotenv').config();

import fs from 'fs';
import { promisify } from 'util';
const readdir = promisify(fs.readdir);

interface Command {
  name: string;
  description: string;
  usage?: string;
  group: string;
  requiredPermissions?: string[];
  guildOnly: boolean;
  aliases?: string[];
  execute(message: Discord.Message, commandArgs: string[]): void;
}

async function loadAllCommands(commandsDir: string, commandGroups: string[]) {
  let result = new Discord.Collection<string, Command>();

  // For all directories in `commandGroups` (with `commandsDir` as root),
  // store all commands in `result`.
  for (const group of commandGroups) {
    try {
      const commandFiles = await readdir(
        `${__dirname}/${commandsDir}/${group}`,
      );

      for (const file of commandFiles) {
        const command: Command = require(`${__dirname}/${commandsDir}/${group}/${file}`);
        result.set(command.name, command);
      }
    } catch (err) {
      console.error(`Unable to load group ${group}. Error: ${err}`);
    }
  }

  return result;
}

const client = new Discord.Client();
let commands: Discord.Collection<string, Command>;
const prefix = '>>';

client.once('ready', async () => {
  console.log(
    `Logging in with ${client.user.username}#${client.user.discriminator}`,
  );

  try {
    commands = await loadAllCommands('commands', ['general', 'moderation']);
  } catch (err) {
    console.error(`Unable to load groups. Error: ${err}`);
  }
});

client.on('message', async message => {
  // If command is not of valid format or is written by a bot, return
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    message.content.trim().length === prefix.length
  ) {
    return;
  }

  const commandArgs = message.content.slice(prefix.length).split(/ +/);
  const commandName = commandArgs.shift() || '';

  // Try to get command by primary name, otherwise check aliases
  const command =
    commands.get(commandName) ||
    commands.find(
      command =>
        command.hasOwnProperty('aliases') &&
        command.aliases!.includes(commandName),
    );

  // If command/aliases not found, return
  if (!command) {
    return;
  }

  // Filter guild-only commands
  if (command.guildOnly && message.channel.type !== 'text') {
    await message.channel.send(`Error! I can't use that command in DMs!`);
    return;
  }

  // Check if user has required permissions to run the command
  if (
    command.requiredPermissions &&
    !message.member.hasPermission(
      command.requiredPermissions as Discord.PermissionResolvable,
    )
  ) {
    await message.channel.send(
      "Error! You don't have permissions to run this command!",
    );
  }

  try {
    await command.execute(message, commandArgs);
  } catch (err) {
    // TODO: Better error handling
    console.error(`An error occurred! ${err}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
