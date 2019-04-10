import { Pool, PoolClient } from 'pg';

export class UsersDb {
  private pgPool: Pool;

  constructor(connectionUri: string, errorHandler: (err: Error, client: PoolClient) => void) {
    this.pgPool = new Pool({ connectionString: connectionUri });
    this.pgPool.on('error', errorHandler);
  }

  public async initialize() {
    await this.pgPool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        guild_id VARCHAR(20) NOT NULL,
        user_id VARCHAR(20) NOT NULL,
        exp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
      )`,
    );
  }

  public async getAllUsers() {
    const { rows } = await this.pgPool.query('SELECT * FROM users');
    return rows;
  }

  public async getUser(guildId: string, userId: string) {
    const { rows } = await this.pgPool.query(
      'SELECT * FROM users WHERE guild_id = $1 AND user_id = $2',
      [guildId, userId],
    );
    if (rows.length === 0) {
      throw new Error('User was not found!');
    }

    return rows[0];
  }
}
