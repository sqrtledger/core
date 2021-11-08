import { IAccountRepository } from '../../interfaces';
import { IAccount } from '../../models';

export class InMemoryAccountRepository implements IAccountRepository {
  protected accounts: Array<IAccount> = [];

  public async create(
    account: IAccount,
    tenantId: string | null
  ): Promise<IAccount> {
    this.accounts.push({
      ...account,
    });

    return account;
  }

  public async delete(
    reference: string,
    tenantId: string | null
  ): Promise<void> {}

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<IAccount | null> {
    return (
      this.accounts.find((x: IAccount) => x.reference === reference) || null
    );
  }

  public async updateAvailableBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const account: IAccount | null =
      this.accounts.find((x: IAccount) => x.reference === reference) || null;

    if (!account) {
      throw new Error('account not found');
    }

    account.availableBalance += amount;

    return account;
  }

  public async updateBalance(
    amount: number,
    reference: string,
    tenantId: string | null
  ): Promise<IAccount> {
    const account: IAccount | null =
      this.accounts.find((x: IAccount) => x.reference === reference) || null;

    if (!account) {
      throw new Error('account not found');
    }

    account.balance += amount;

    return account;
  }
}
