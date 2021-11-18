import { ICustomerRepository } from '../interfaces';
import { ICustomer } from '../models';

export class CustomerService {
  constructor(protected customerRepository: ICustomerRepository) {}

  public async create(
    customer: ICustomer,
    tenantId: string | null = null
  ): Promise<ICustomer> {
    return await this.customerRepository.create(customer, tenantId);
  }

  public async find(
    emailAddress: string,
    tenantId: string | null = null
  ): Promise<ICustomer | null> {
    return await this.customerRepository.find(emailAddress, tenantId);
  }
}
