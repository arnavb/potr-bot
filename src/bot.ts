import Discord from 'discord.js';
import { readdir as rd } from 'fs';
import { promisify } from 'util';
import { Logger } from 'winston';
import { BotDb } from './bot-db';
import { Command } from './command';
import { randInt } from './utils';

const readdir = promisify(rd);

interface BotConfig {
  prefix: string;
  postgresDbUri: string;
  discordBotToken: string;
  commandsDir: string;
  commandGroups: string[];
  logger: Logger;
}

export class Bot {
  private client: Discord.Client;
  private db: BotDb;
  private commands: Discord.Collection<string, Command>;
  private logger: Logger;

  constructor(private config: BotConfig) {
    this.logger = this.config.logger;
    this.client = new Discord.Client();
    this.db = new BotDb(this.config.postgresDbUri, this.logger.error);
    this.commands = new Discord.Collection();

    this.client.once('ready', this.onceReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));
    this.client.on('error', this.logger.error);
  }

  public start() {
    this.client.login(this.config.discordBotToken);
  }

  private async onceReady() {
    this.logger.info(
      `Logging in with ${this.client.user.username}#${this.client.user.discriminator}`,
    );

    // Setup database
    await this.db.initialize();

    this.logger.info('Initialized database');

    try {
      this.commands = await this.loadAllCommands(
        this.config.commandsDir,
        this.config.commandGroups,
      );
    } catch (err) {
      this.logger.error(`Unable to load groups. Error: ${err.stack}`);
    }
  }

  private async onMessage(message: Discord.Message) {
    // If command is not of valid format or is written by a bot, return
    if (message.author.bot) {
      return;
    }

    if (message.channel.type === 'text') {
      await this.db.createClient();

      const randomExpAmount = randInt(20, 30);

      await this.db.upsertUser(message.guild.id, message.author.id, randomExpAmount);

      const { exp, level } = (await this.db.getUserRow(message.guild.id, message.author.id))
        .row as any;

      // 100 exp required for each level. Will be changed later
      if (exp > level * 100) {
        await this.db.increaseUserLevel(message.guild.id, message.author.id);
        await message.channel.send(
          `Congratulations ${message.author}! You've leveled up to level ${level + 1}`,
        );
      }

      await this.db.releaseClient();
    }

    if (
      !message.content.startsWith(this.config.prefix) ||
      message.content.trim().length === this.config.prefix.length
    ) {
      return;
    }

    const commandArgs = message.content.slice(this.config.prefix.length).split(/ +/);
    const commandName = commandArgs.shift() || '';

    // Try to get command by primary name, otherwise check aliases
    const command =
      this.commands.find(cmd => cmd.details.name === commandName) ||
      this.commands.find(
        cmd => cmd.hasOwnProperty('aliases') && cmd.details.aliases!.includes(commandName),
      );

    // If command/aliases not found, return
    if (!command) {
      return;
    }

    // Filter commands with wrong number of arguments
    if (command.details.usage) {
      const numberOfArgs = command.details.usage
        .split(' ')
        .filter(arg => arg.startsWith('<') && arg.endsWith('>'));

      if (commandArgs.length < numberOfArgs.length) {
        await message.channel.send(
          `The command \`${commandName}\` expects ${numberOfArgs.length - commandArgs.length}` +
            ` more argument(s)!\n` +
            `The correct usage would be \`${this.config.prefix}${commandName} ${
              command.details.usage
            }\``,
        );
        return;
      }
    }

    // Filter guild-only commands
    if (command.details.guildOnly && message.channel.type !== 'text') {
      await message.channel.send("I can't use that command in DMs!");
      return;
    }

    // Check if user has required permissions to run the command
    if (
      command.details.requiredPermissions &&
      !message.member.hasPermission(command.details
        .requiredPermissions as Discord.PermissionResolvable)
    ) {
      await message.channel.send("You don't have the required permissions to run this command!");
      return;
    }

    try {
      await command.execute(message, commandArgs);
    } catch (err) {
      // TODO: Better error handling
      await message.channel.send('An error occurred while running this command!');
      this.logger.error(`An error occurred! ${err.stack}`);
    }
  }

  private async loadAllCommands(commandsDir: string, commandGroups: string[]) {
    const result = new Discord.Collection<string, Command>();

    // For all directories in `commandGroups` (with `commandsDir` as root),
    // store all commands in `result`.
    for (const group of commandGroups) {
      try {
        const commandFiles = (await readdir(`${__dirname}/${commandsDir}/${group}`)).filter(file =>
          file.endsWith('.js'),
        );

        for (const file of commandFiles) {
          // Use default export to require each command class without having to deal
          // with each command class having its own name (although this can be omitted with default exports)
          // Hopefully another solution is possible without default exports
          const commandClass = require(`${__dirname}/${commandsDir}/${group}/${file}`).default;

          const commandObject: Command = new commandClass(this.db);
          result.set(commandObject.details.name, commandObject);
        }
      } catch (err) {
        this.logger.error(`Unable to load group ${group}. Error: ${err.stack}`);
      }
    }

    return result;
  }
}
