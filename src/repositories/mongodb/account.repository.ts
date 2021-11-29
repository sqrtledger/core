import * as MongoDb from 'mongodb';
import { IAccountRepository } from '../../interfaces';
import { IAccount } from '../../models';

export class MongoDbAccountRepository implements IAccountRepository {
  constructor(protected collection: MongoDb.Collection) {}

  public async create(
    account: IAccount,
    tenantId: string | null
  ): Promise<IAccount> {
    const insertOneResult = await this.collection.insertOne({
      ...account,
      tenantId,
    });

    return account;
  }

  public async delete(
    reference: string,
    tenantId: string | null
  ): Promise<void> {
    await this.collection.deleteOne({
      reference,
      tenantId,
    });
  }

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<IAccount | null> {
    return await this.collection.findOne<IAccount>(
      {
        reference,
        tenantId,
      },
      {
        projection: {
          _id: 0,
          tenantId: 0,
        },
      }
    );
  }

  public async updateAvailableBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const updateResult = await this.collection.updateOne(
      {
        reference,
        tenantId,
      },
      {
        $inc: {
          availableBalance: amount,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('account not found');
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error('account not found');
    }

    const account: IAccount | null = await this.find(reference, tenantId);

    if (!account) {
      throw new Error('account not found');
    }

    return account;
  }

  public async updateBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const updateResult = await this.collection.updateOne(
      {
        reference,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('account not found');
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error('account not found');
    }

    const account: IAccount | null = await this.find(reference, tenantId);

    if (!account) {
      throw new Error('account not found');
    }

    return account;
  }
}
