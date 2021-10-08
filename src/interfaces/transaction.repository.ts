import { ITransaction } from '../models';

export interface ITransactionRepository {
  create(transaction: ITransaction): Promise<ITransaction>;

  update(transaction: ITransaction): Promise<ITransaction>;
}
