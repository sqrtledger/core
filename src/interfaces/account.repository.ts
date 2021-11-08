import { IAccount } from '../models';

export interface IAccountRepository {
  create(account: IAccount, tenantId: string | null): Promise<IAccount>;

  delete(reference: string, tenantId: string | null): Promise<void>;

  find(reference: string, tenantId: string | null): Promise<IAccount | null>;

  updateAvailableBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount>;

  updateBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount>;
}
