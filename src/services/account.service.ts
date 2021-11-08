import { IAccountRepository } from '../interfaces';
import { IAccount } from '../models';
import { AccountValidator } from '../validators';

export class AccountService {
  constructor(protected accountRepository: IAccountRepository) {}

  public async create(
    account: IAccount,
    tenantId: string | null = null
  ): Promise<IAccount> {
    AccountValidator.validate(account);

    return await this.accountRepository.create(account, tenantId);
  }

  public async delete(
    reference: string,
    tenantId: string | null = null
  ): Promise<void> {
    await this.accountRepository.delete(reference, tenantId);
  }

  public async find(
    reference: string,
    tenantId: string | null = null
  ): Promise<IAccount | null> {
    return await this.accountRepository.find(reference, tenantId);
  }
}
