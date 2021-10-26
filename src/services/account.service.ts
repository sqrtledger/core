import { IAccountRepository } from '../interfaces';
import { IAccount } from '../models';
import { AccountValidator } from '../validators';

export class AccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public async create(account: IAccount): Promise<IAccount> {
    AccountValidator.validate(account);

    return await this.accountRepository.create(account);
  }

  public async delete(reference: string): Promise<void> {
    await this.accountRepository.delete(reference);
  }

  public async find(reference: string): Promise<IAccount | null> {
    return await this.accountRepository.find(reference);
  }
}
