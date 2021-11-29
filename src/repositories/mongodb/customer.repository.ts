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
      tenantId,
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

  public async update(
    customer: ICustomer,
    tenantId: string | null
  ): Promise<ICustomer> {
    const updateResult = await this.collection.replaceOne(
      {
        emailAddress: customer.emailAddress,
        tenantId,
      },
      {
        ...customer,
      }
    );

    if (updateResult.matchedCount === 0) {
      throw new Error('customer not found');
    }

    if (updateResult.modifiedCount === 0) {
      throw new Error('customer not found');
    }

    return customer;
  }
}
