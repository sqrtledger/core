import { IAccount, ITransaction } from '../models';

export interface ITransactionRepository {
  create(account: IAccount, transaction: ITransaction): Promise<ITransaction>;

  findAll(account: IAccount): Promise<Array<ITransaction>>;

  update(account: IAccount, transaction: ITransaction): Promise<ITransaction>;
}
