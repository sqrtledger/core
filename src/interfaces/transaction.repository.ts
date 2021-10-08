import { IAccount, ITransaction } from '../models';

export interface ITransactionRepository {
  create(account: IAccount, transaction: ITransaction): Promise<ITransaction>;

  update(account: IAccount, transaction: ITransaction): Promise<ITransaction>;
}
