import { IAccountRepository } from '../interfaces';
import { IAccount } from '../models';

export class AccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public async find(reference: string): Promise<IAccount> {
    throw new Error('not implemented');
  }
}
