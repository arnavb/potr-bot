import { config } from 'dotenv';
import { createLogger, format, transports } from 'winston';
import { Bot } from './bot';
config();

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format(info => {
          info.level = info.level.padEnd(5);
          return info;
        })(),
        format.colorize(),
        format.printf(({ timestamp, level, message, meta }) => {
          const metaString = meta === undefined ? '' : meta;
          return `${timestamp} ${level} - ${message} ${metaString}`;
        }),
      ),
    }),
  );
}

new Bot({
  prefix: '>>',
  discordBotToken: process.env.DISCORD_BOT_TOKEN!,
  postgresDbUri: process.env.POSTGRES_DB_URI!,
  commandsDir: 'commands',
  commandGroups: ['general', 'moderation'],
  logger,
}).start();
