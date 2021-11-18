import * as MongoDb from 'mongodb';
import { ICustomerRepository } from '../../interfaces';
import { ICustomer } from '../../models';

export class MongoDbCustomerRepository implements ICustomerRepository {
  constructor(protected collection: MongoDb.Collection) {}

  public async create(
    customer: ICustomer,
    tenantId: string | null
  ): Promise<ICustomer> {
    const insertOneResult = await this.collection.insertOne({
      ...customer,
    });

    return customer;
  }

  public async find(
    emailAddress: string,
    tenantId: string | null
  ): Promise<ICustomer | null> {
    return await this.collection.findOne<ICustomer>(
      {
        emailAddress,
      },
      {
        projection: {
          _id: 0,
        },
      }
    );
  }

  public async update(
    customer: ICustomer,
    tenantId: string | null
  ): Promise<ICustomer> {
    const updateResult = await this.collection.replaceOne(
      {
        emailAddress: customer.emailAddress,
      },
      {
        ...customer,
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('TODO');
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error('TODO');
    }

    return customer;
  }
}
