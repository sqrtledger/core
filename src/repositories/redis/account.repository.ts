import { IAccountRepository, IMutex } from '../../interfaces';
import { IAccount } from '../../models';
import * as Redis from 'redis';

export class RedisAccountRepository implements IAccountRepository {
  constructor(
    protected mutex: IMutex,
    protected redisClient: Redis.RedisClient
  ) {}

  public async create(
    account: IAccount,
    tenantId: string | null
  ): Promise<IAccount> {
    try {
      await this.mutex.acquire(`account-${account.reference}`);

      if (await this.find(account.reference, tenantId)) {
        throw new Error('account exist');
      }

      const json: string = JSON.stringify(account);

      await new Promise((resolve, reject) => {
        this.redisClient.set(account.reference, json, (error: Error | null) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(null);
        });
      });

      return account;
    } finally {
      await this.mutex.release(`account-${account.reference}`);
    }
  }

  public async delete(
    reference: string,
    tenantId: string | null
  ): Promise<void> {
    try {
      await this.mutex.acquire(`account-${reference}`);

      if (await this.find(reference, tenantId)) {
        throw new Error('account does not exist');
      }

      await new Promise((resolve, reject) => {
        this.redisClient.del(reference, (error: Error | null) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(null);
        });
      });
    } finally {
      await this.mutex.release(`account-${reference}`);
    }
  }

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<IAccount | null> {
    const json: string | null = await new Promise((resolve, reject) => {
      this.redisClient.get(
        `account-${reference}`,
        (error: Error | null, reply: string | null) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(reply);
        }
      );
    });

    if (!json) {
      return null;
    }

    return JSON.parse(json);
  }

  public async updateAvailableBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const json: string | null = await new Promise((resolve, reject) => {
      this.redisClient.get(
        `account-${reference}`,
        (error: Error | null, reply: string | null) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(reply);
        }
      );
    });

    if (!json) {
      throw new Error('account not found');
    }

    // availableBalance

    const account: IAccount = JSON.parse(json);

    return account;
  }

  public async updateBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const json: string | null = await new Promise((resolve, reject) => {
      this.redisClient.get(
        `account-${reference}`,
        (error: Error | null, reply: string | null) => {
          if (error) {
            reject(error);

            return;
          }

          resolve(reply);
        }
      );
    });

    if (!json) {
      throw new Error('account not found');
    }

    // balance

    const account: IAccount = JSON.parse(json);

    return account;
  }
}
