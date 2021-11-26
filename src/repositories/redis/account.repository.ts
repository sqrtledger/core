import { IAccountRepository, IMutex } from '../../interfaces';
import { IAccount } from '../../models';

export class RedisAccountRepository implements IAccountRepository {
  constructor(
    protected mutex: IMutex,
    protected redisClient: {
      del: (key: string) => Promise<void>;
      get: (key: string) => Promise<string | null>;
      set: (key: string, value: string) => Promise<void>;
    }
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

      await this.redisClient.set(
        `account-${account.reference}`,
        JSON.stringify(account)
      );

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

      await this.redisClient.del(`account-${reference}`);
    } finally {
      await this.mutex.release(`account-${reference}`);
    }
  }

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<IAccount | null> {
    const json: string | null = await this.redisClient.get(
      `account-${reference}`
    );

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
    try {
      await this.mutex.acquire(`account-${reference}`);

      let json: string | null = await this.redisClient.get(
        `account-${reference}`
      );

      if (!json) {
        throw new Error('account not found');
      }

      const account: IAccount = JSON.parse(json);

      account.availableBalance += amount;

      await this.redisClient.set(
        `account-${reference}`,
        JSON.stringify(account)
      );

      return account;
    } finally {
      await this.mutex.release(`account-${reference}`);
    }
  }

  public async updateBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    try {
      await this.mutex.acquire(`account-${reference}`);

      let json: string | null = await this.redisClient.get(
        `account-${reference}`
      );

      if (!json) {
        throw new Error('account not found');
      }

      const account: IAccount = JSON.parse(json);

      account.balance += amount;

      await this.redisClient.set(
        `account-${reference}`,
        JSON.stringify(account)
      );

      return account;
    } finally {
      await this.mutex.release(`account-${reference}`);
    }
  }
}
