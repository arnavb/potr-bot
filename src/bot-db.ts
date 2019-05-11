import { Pool, PoolClient } from 'pg';
import { SQL, SQLStatement } from 'sql-template-strings';

export class BotDb {
  private pgPool: Pool;
  private currentClient?: PoolClient;

  constructor(connectionUri: string, errorHandler: (err: Error, client: PoolClient) => void) {
    this.pgPool = new Pool({ connectionString: connectionUri });
    this.pgPool.on('error', errorHandler);
    this.currentClient = undefined;
  }

  public async createClient() {
    this.currentClient = await this.pgPool.connect();
  }

  public async releaseClient() {
    if (this.currentClient) {
      this.currentClient.release();
    }
  }

  public async initialize() {
    await this.executeQuery(
      SQL`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR (20) NOT NULL,
        user_id VARCHAR (20) NOT NULL,
        exp INTEGER NOT NULL,
        level INTEGER DEFAULT 0,
        UNIQUE (guild_id, user_id)
      )`,
    );
  }

  public async getUserRow(guildId: string, userId: string) {
    const { rows, rowCount } = await this.executeQuery(
      SQL`SELECT * FRO users WHERE guild_id = ${guildId} AND user_id = ${userId}`,
    );
    return { row: rows[0], rowCount };
  }

  public async increaseUserLevel(guildId: string, userId: string) {
    await this.executeQuery(
      SQL`UPDATE users SET level = level + 1 WHERE guild_id = ${guildId} AND user_id = ${userId}`,
    );
  }

  public async upsertUser(guildId: string, userId: string, exp: number) {
    const query = SQL`
      INSERT INTO users (guild_id, user_id, exp) VALUES
        (${guildId}, ${userId}, ${exp})
        ON CONFLICT (guild_id, user_id) DO
          UPDATE SET
            exp = users.exp + $3
    `;
    await this.executeQuery(query);
  }

  private async executeQuery(query: SQLStatement) {
    let result;
    if (this.currentClient) {
      result = await this.currentClient.query(query);
    } else {
      result = await this.pgPool.query(query);
    }
    return result;
  }
}
