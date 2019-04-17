import { config } from 'dotenv';
import { PotrBot } from './potr-bot';
config();

const potrBot = new PotrBot({
  prefix: '>>',
  discordBotToken: process.env.DISCORD_BOT_TOKEN!,
  postgresDbUri: process.env.POSTGRES_DB_URI!,
});

potrBot.start();
