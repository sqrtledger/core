import { ITransactionRepository } from '../../interfaces';
import { IAccount, ITransaction } from '../../models';

export class InMemoryTransactionRepository implements ITransactionRepository {
  public async create(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
  ): Promise<ITransaction> {
    return transaction;
  }

  public async find(
    reference: string,
    tenantId: string | null
  ): Promise<ITransaction | null> {
    return null;
  }

  public async findAll(
    account: IAccount,
    filter: { [key: string]: number | string },
    tenantId: string | null
  ): Promise<Array<ITransaction>> {
    return [];
  }

  public async update(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
  ): Promise<ITransaction> {
    return transaction;
  }
}
