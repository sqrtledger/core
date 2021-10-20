import * as MongoDb from 'mongodb';
import { ITransactionRepository } from '../../interfaces';
import { IAccount, ITransaction } from '../../models';

export class MongoDbTransactionRepository implements ITransactionRepository {
  constructor(protected collection: MongoDb.Collection) {}

  public async create(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    await this.collection.insertOne({
      ...transaction,
      accountReference: account.reference,
    });

    return transaction;
  }

  public async findAll(
    account: IAccount,
    filter: { [key: string]: number | string }
  ): Promise<Array<ITransaction>> {
    return await this.collection
      .find<ITransaction>(
        {
          accountReference: account.reference,
          status: 'completed',
          ...filter,
        },
        {
          limit: 25,
          projection: {
            _id: 0,
            accountReference: 0,
          },
          sort: {
            timestamp: -1,
          },
        }
      )
      .toArray();
  }

  public async update(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    await this.collection.updateOne(
      {
        reference: transaction.reference,
      },
      {
        $set: {
          status: transaction.status,
        },
      }
    );

    return transaction;
  }
}
