import { ICustomer } from '../models';

export interface ICustomerRepository {
  create(customer: ICustomer, tenantId: string | null): Promise<ICustomer>;

  find(emailAddres: string, tenantId: string | null): Promise<ICustomer | null>;
}
