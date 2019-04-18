import { config } from 'dotenv';
import { Bot } from './bot';
config();

const potrBot = new Bot({
  prefix: '>>',
  discordBotToken: process.env.DISCORD_BOT_TOKEN!,
  postgresDbUri: process.env.POSTGRES_DB_URI!,
});

potrBot.start();
