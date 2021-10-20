import { IAccount, ITransaction } from '../models';

export interface ITransactionRepository {
  create(account: IAccount, transaction: ITransaction): Promise<ITransaction>;

  findAll(
    account: IAccount,
    filter: { [key: string]: number | string }
  ): Promise<Array<ITransaction>>;

  update(account: IAccount, transaction: ITransaction): Promise<ITransaction>;
}
