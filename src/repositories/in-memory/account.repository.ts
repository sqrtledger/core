import { IAccountRepository } from '../../interfaces';
import { IAccount } from '../../models';

export class InMemoryAccountRepository implements IAccountRepository {
  protected accounts: Array<IAccount> = [];

  public async create(account: IAccount): Promise<IAccount> {
    this.accounts.push({
      ...account,
    });

    return account;
  }

  public async delete(reference: string): Promise<void> {}

  public async find(reference: string): Promise<IAccount | null> {
    return (
      this.accounts.find((x: IAccount) => x.reference === reference) || null
    );
  }

  public async updateAvailableBalance(
    amount: number,
    reference: string
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
    reference: string
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
