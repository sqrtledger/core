import { ITransactionRepository } from '../../interfaces';
import { IAccount, ITransaction } from '../../models';

export class InMemoryTransactionRepository implements ITransactionRepository {
  public async create(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    return transaction;
  }

  public async findAll(
    account: IAccount,
    filter: { [key: string]: number | string }
  ): Promise<Array<ITransaction>> {
    return [];
  }

  public async update(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    return transaction;
  }
}
