import { IAccount } from '../models';

export interface IAccountRepository {
  find(reference: string): Promise<IAccount | null>;
}
