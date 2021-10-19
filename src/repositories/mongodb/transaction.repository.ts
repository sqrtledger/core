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

  public async findAll(account: IAccount): Promise<Array<ITransaction>> {
    return await this.collection
      .find<ITransaction>(
        {
          accountReference: account.reference,
        },
        {
          projection: {
            _id: 0,
            accountReference: 0,
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
