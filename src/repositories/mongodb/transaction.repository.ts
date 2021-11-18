import * as MongoDb from 'mongodb';
import { ITransactionRepository } from '../../interfaces';
import { IAccount, ICustomerView, ITransaction } from '../../models';

export class MongoDbTransactionRepository implements ITransactionRepository {
  constructor(protected collection: MongoDb.Collection) {}

  public async create(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
  ): Promise<ITransaction> {
    await this.collection.insertOne({
      ...transaction,
      accountReference: account.reference,
    });

    return transaction;
  }

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<ITransaction | null> {
    return await this.collection.findOne<ITransaction>(
      {
        reference,
        status: 'completed',
      },
      {
        projection: {
          _id: 0,
          accountReference: 0,
        },
      }
    );
  }

  public async findAll(
    account: IAccount,
    filter: { [key: string]: number | string },
    tenantId: string | null
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

  public async findAllCustomers(
    accountReference: string,
    tenantId: string | null
  ): Promise<Array<ICustomerView>> {
    const result = await this.collection
      .aggregate([
        {
          $match: {
            accountReference,
            status: 'completed',
          },
        },
        {
          $group: {
            _id: {
              emailAddress: '$customer.emailAddress',
              metadata: '$customer.metadata',
              name: '$customer.name',
            },
          },
        },
      ])
      .toArray();

    return result.map((x) => x._id);
  }

  public async update(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
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
