import { BotDb } from './bot-db';

interface CommandDetails {
  name: string;
  description: string;
  usage?: string;
  group: string;
  requiredPermissions?: string[];
  guildOnly: boolean;
  aliases?: string[];
}

export abstract class Command {
  constructor(protected commandDetails: CommandDetails, protected db: BotDb) {}

  abstract async execute(
    message: import('discord.js').Message,
    commandArgs: string[],
  ): Promise<void>;
}
