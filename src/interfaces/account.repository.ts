import { IAccount } from '../models';

export interface IAccountRepository {
  create(account: IAccount): Promise<IAccount>;

  delete(reference: string): Promise<void>;

  find(reference: string): Promise<IAccount | null>;

  updateAvailableBalance(amount: number, reference: string): Promise<IAccount>;

  updateBalance(amount: number, reference: string): Promise<IAccount>;
}
