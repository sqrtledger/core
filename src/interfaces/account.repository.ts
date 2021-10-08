import { IAccount } from '../models';

export interface IAccountRepository {
  find(reference: string): Promise<IAccount | null>;

  updateAvailableBalance(
    amount: number,
    reference: string
  ): Promise<IAccount | null>;

  updateBalance(amount: number, reference: string): Promise<IAccount | null>;
}
