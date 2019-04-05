import Database from 'better-sqlite3';
import Discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { promisify } from 'util';
const readdir = promisify(fs.readdir);

interface ICommand {
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
  const result = new Discord.Collection<string, ICommand>();

  // For all directories in `commandGroups` (with `commandsDir` as root),
  // store all commands in `result`.
  for (const group of commandGroups) {
    try {
      const commandFiles = (await readdir(`${__dirname}/${commandsDir}/${group}`)).filter(file =>
        file.endsWith('.js'),
      );

      for (const file of commandFiles) {
        const commandObject: ICommand = require(`${__dirname}/${commandsDir}/${group}/${file}`);
        result.set(commandObject.name, commandObject);
      }
    } catch (err) {
      console.error(`Unable to load group ${group}. Error: ${err}`);
    }
  }

  return result;
}

const client = new Discord.Client();
const db = new Database('./db/UserPoints.db');
let commands: Discord.Collection<string, ICommand>;
const prefix = '>>';

client.once('ready', async () => {
  console.log(`Logging in with ${client.user.username}#${client.user.discriminator}`);

  // Create the database to store users
  db.prepare(
    `
   CREATE TABLE IF NOT EXISTS UserPoints (
      Id TEXT PRIMARY KEY,
      GuildId TEXT NOT NULL,
      UserId TEXT NOT NULL,
      Experience INTEGER,
      Level INTEGER
);
  `,
  ).run();

  db.pragma('synchronous = normal');
  db.pragma('journal_mode = wal');

  try {
    commands = await loadAllCommands('commands', ['general', 'moderation']);
  } catch (err) {
    console.error(`Unable to load groups. Error: ${err}`);
  }
});

client.on('message', async message => {
  const getUser = db.prepare('SELECT * FROM UserPoints WHERE GuildId = ? AND UserId = ?;');
  const setUser = db.prepare(`INSERT OR REPLACE INTO UserPoints (Id, GuildId, UserId, Experience, Level)
VALUES (@Id, @GuildId, @UserId, @Experience, @Level);`);

  // If command is not of valid format or is written by a bot, return
  if (message.author.bot) {
    return;
  }

  if (message.guild) {
    let userScore = getUser.get(message.guild.id, message.author.id);

    if (!userScore) {
      userScore = {
        Id: `${message.guild.id}-${message.author.id}`,
        GuildId: message.guild.id,
        UserId: message.author.id,
        Experience: 0,
        Level: 1,
      };
    }

    userScore.Experience += Math.random() * 10 + 20;

    if (userScore.Experience > 100 * userScore.Level) {
      ++userScore.Level;
      await message.channel.send(`Congratulations ${message.member}! You've leveled up to ${userScore.Level}!`);
    }

    console.log(`${message.author.username} just sent a message: ${message.content}`);
    console.log(`Exp details:`);
    console.log(userScore);

    setUser.run(userScore);
  }

  if (!message.content.startsWith(prefix) || message.content.trim().length === prefix.length) {
    return;
  }

  const commandArgs = message.content.slice(prefix.length).split(/ +/);
  const commandName = commandArgs.shift() || '';

  // Try to get command by primary name, otherwise check aliases
  const command =
    commands.get(commandName) ||
    commands.find(cmd => cmd.hasOwnProperty('aliases') && cmd.aliases!.includes(commandName));

  // If command/aliases not found, return
  if (!command) {
    return;
  }

  // Filter commands with wrong number of arguments
  if (command.usage) {
    const numberOfArgs = command.usage
      .split(' ')
      .filter(arg => arg.startsWith('<') && arg.endsWith('>'));
    if (commandArgs.length < numberOfArgs.length) {
      await message.channel.send(
        `The command \`${commandName}\` expects ${numberOfArgs.length - commandArgs.length}` +
          `more argument(s)!\n` +
          `The correct usage would be \`${prefix}${commandName} ${command.usage}\``,
      );
      return;
    }
  }

  // Filter guild-only commands
  if (command.guildOnly && message.channel.type !== 'text') {
    await message.channel.send("I can't use that command in DMs!");
    return;
  }

  // Check if user has required permissions to run the command
  if (
    command.requiredPermissions &&
    !message.member.hasPermission(command.requiredPermissions as Discord.PermissionResolvable)
  ) {
    await message.channel.send("You don't have the required permissions to run this command!");
    return;
  }

  try {
    await command.execute(message, commandArgs);
  } catch (err) {
    // TODO: Better error handling
    await message.channel.send('An error occurred while running this command!');
    console.error(`An error occurred! ${err}`);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
