const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);

const Discord = require('discord.js');

require('dotenv').config();

const client = new Discord.Client();

const prefix = '>>';

/**
 * @param {string} commandsDir
 * @param {Array<string>} commandGroups
 */
async function loadAllCommands(commandsDir, commandGroups) {
  let result = new Discord.Collection();

  for (const group of commandGroups) {
    try {
      const commandFiles = await readdir(`./${commandsDir}/${group}`);

      for (const file of commandFiles) {
        const command = require(`./${commandsDir}/${group}/${file}`);
        result.set(command.name, command);
      }
    } catch (err) {
      console.error(`Unable to load group ${group}. Error: ${err}`);
    }
  }

  return result;
}

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
  if (
    !message.content.startsWith(prefix) ||
    message.author.bot ||
    message.content.trim().length === prefix.length
  ) {
    return;
  }

  const commandArgs = message.content.slice(prefix.length).split(/ +/);
  const command = commandArgs.shift();

  try {
    await client.commands.get(command).execute(message, commandArgs);
  } catch (err) {
      console.error(`An error occurred! ${err}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
