import { Pool, PoolClient } from 'pg';

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
      `CREATE TABLE IF NOT EXISTS users (
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
      'SELECT * FROM users WHERE guild_id = $1 AND user_id = $2',
      guildId,
      userId,
    );
    return { row: rows[0], rowCount };
  }

  public async increaseUserLevel(guildId: string, userId: string) {
    await this.executeQuery(
      'UPDATE users SET level = level + 1 WHERE guild_id = $1 AND user_id = $2',
      guildId,
      userId,
    );
  }

  public async upsertUser(guildId: string, userId: string, exp: number) {
    const query = `
      INSERT INTO users (guild_id, user_id, exp) VALUES
        ($1, $2, $3)
        ON CONFLICT (guild_id, user_id) DO
          UPDATE SET
            exp = users.exp + $3
    `;
    await this.executeQuery(query, guildId, userId, exp);
  }

  private async executeQuery(query: string, ...params: Array<string | number>) {
    let result;
    if (this.currentClient) {
      result = await this.currentClient.query(query, params);
    } else {
      result = await this.pgPool.query(query, params);
    }
    return result;
  }
}
