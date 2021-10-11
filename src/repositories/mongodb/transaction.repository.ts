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
