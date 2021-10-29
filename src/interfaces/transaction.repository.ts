import { IAccount, ITransaction } from '../models';

export interface ITransactionRepository {
  create(account: IAccount, transaction: ITransaction): Promise<ITransaction>;

  find(reference: string): Promise<ITransaction | null>;

  findAll(
    account: IAccount,
    filter: { [key: string]: number | string }
  ): Promise<Array<ITransaction>>;

  update(account: IAccount, transaction: ITransaction): Promise<ITransaction>;
}
