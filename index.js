const Discord = require('discord.js');
require('dotenv').config();

const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

/**
 * Object representing a Discord command
 * @typedef {Object} Command
 * @property {string} name Name of the command
 * @property {string} description Description of the command
 * @property {string} [usage] Usage string of the command
 * @property {string} group Command category to group this command with
 * @property {Array<string>} [requiredPermissions] Permissions this command requires to execute
 * @property {bool} [guildOnly] Whether this command can be executed outside of guilds
 * @property {Array<string>} [aliases] Any aliases this command has
 */

/**
 * @param {string} commandsDir
 * @param {Array<string>} commandGroups
 */
async function loadAllCommands(commandsDir, commandGroups) {
  /**
   * @type {Discord.Collection<string, Command>}
   */
  let result = new Discord.Collection();

  // For all directories in `commandGroups` (with `commandsDir` as root),
  // store all commands in `result`.
  for (const group of commandGroups) {
    try {
      const commandFiles = await readdir(`./${commandsDir}/${group}`);

      for (const file of commandFiles) {
        /** @type {Command} */
        const command = require(`./${commandsDir}/${group}/${file}`);
        result.set(command.name, command);
      }
    } catch (err) {
      console.error(`Unable to load group ${group}. Error: ${err}`);
    }
  }

  return result;
}

const client = new Discord.Client();
const prefix = '>>';

client.once('ready', async () => {
  console.log(
    `Logging in with ${client.user.username}#${client.user.discriminator}`,
  );

  try {
    client.commands = await loadAllCommands('commands', [
      'general',
      'moderation',
    ]);
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
  const commandName = commandArgs.shift();

  // Try to get command by primary name, otherwise check aliases
  /** @type {Command} */
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      command => command.aliases && command.aliases.includes(commandName),
    );

  // If command/aliases not found, return
  if (!command) {
    return;
  }

  // Check if user has required permissions to run the command
  if (
    command.requiredPermissions &&
    !message.member.hasPermission(command.requiredPermissions)
  ) {
    await message.channel.send(
      "Error! You don't have permissions to run this command!",
    );
  }

  // Filter guild-only commands
  if (command.guildOnly && message.channel.type !== 'text') {
    await message.channel.send(`Error! I can't use that command in DMs!`);
    return;
  }

  try {
    await command.execute(message, commandArgs);
  } catch (err) {
    // TODO: Better error handling
    console.error(`An error occurred! ${err}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
