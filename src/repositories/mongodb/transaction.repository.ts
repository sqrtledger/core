import { ITransactionRepository } from '../../interfaces';
import { IAccount, ITransaction } from '../../models';

export class MongoDbTransactionRepository implements ITransactionRepository {
  public async create(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    return transaction;
  }

  public async update(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction> {
    return transaction;
  }
}
