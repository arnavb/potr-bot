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
    this.db = new BotDb(this.config.postgresDbUri, this.dbErrorHandler.bind(this));
    this.commands = new Discord.Collection();

    this.client.once('ready', this.onceReady.bind(this));
    this.client.on('message', this.onMessage.bind(this));
    this.client.on('error', this.clientErrorHandler.bind(this));
  }

  public async start() {
    try {
      await this.client.login(this.config.discordBotToken);
    } catch (err) {
      // This exception handler doesn't catch `UnhandledPromiseRejectionWarning`s
      // because the code that calls each event callback doesn't handle
      // promise rejections (https://stackoverflow.com/q/56094829/6525260)
      this.logger.error('Unknown Error: ', err);
      process.exit(1);
    }
  }

  // Websocket error handler
  private clientErrorHandler(err: any) {
    this.logger.error('Client Error: ', err.error);
  }

  private dbErrorHandler(err: Error) {
    this.logger.error('DB Error: ', err);
  }

  private async onceReady() {
    this.logger.info(
      `Logging in with ${this.client.user.username}#${this.client.user.discriminator}`,
    );

    try {
      // Setup database
      await this.db.initialize();
    } catch (err) {
      this.logger.error('Fatal! Failed to connect to DB: ', err);
      process.exit(1);
    }

    this.logger.info('Initialized database');

    try {
      this.commands = await this.loadAllCommands(
        this.config.commandsDir,
        this.config.commandGroups,
      );
    } catch (err) {
      this.logger.error('Fatal! Unable to load groups: ', err);
      process.exit(1);
    }
  }

  private async onMessage(message: Discord.Message) {
    // If command is not of valid format or is written by a bot, return
    if (message.author.bot) {
      return;
    }

    if (message.channel.type === 'text') {
      try {
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
      } catch (err) {
        this.logger.error('DB exp and level operations failed: ', err);
      }
    }

    if (
      !message.content.startsWith(this.config.prefix) ||
      message.content.trim().length === this.config.prefix.length
    ) {
      return;
    }

    const commandArgs = message.content.slice(this.config.prefix.length).split(/ +/);
    const commandName = commandArgs.shift() || '';

    const command = this.commands.find(cmd => {
      // Try to get command by primary name
      if (cmd.details.name === commandName) {
        return true;
      }

      // Check aliases
      if (cmd.details.aliases && cmd.details.aliases.includes(commandName)) {
        return true;
      }
      return false;
    });

    // Make sure command/aliases were found
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
            `The correct usage would be \`${this.config.prefix}${commandName} ${command.details.usage}\``,
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
      await message.channel.send('Sorry! An error occurred while running this command!');
      this.logger.error("An error occurred executing the message '%s': ", commandName, err);
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
        this.logger.error('Unable to load group %s: ', group, err);
      }
    }

    return result;
  }
}
