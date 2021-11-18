import { ICustomerRepository } from '../../interfaces';
import { ICustomer } from '../../models';

export class InMemoryCustomerRepository implements ICustomerRepository {
  protected customers: Array<ICustomer> = [];

  public async create(
    customer: ICustomer,
    tenantId: string | null
  ): Promise<ICustomer> {
    this.customers.push({
      ...customer,
    });

    return customer;
  }

  public async find(
    emailAddress: string,
    tenantId: string | null
  ): Promise<ICustomer | null> {
    return (
      this.customers.find((x: ICustomer) => x.emailAddress === emailAddress) ||
      null
    );
  }
}
