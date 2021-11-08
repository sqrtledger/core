import { IAccount, ITransaction } from '../models';

export interface ITransactionRepository {
  create(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
  ): Promise<ITransaction>;

  find(
    reference: string,
    tenantId: string | null
  ): Promise<ITransaction | null>;

  findAll(
    account: IAccount,
    filter: { [key: string]: number | string },
    tenantId: string | null
  ): Promise<Array<ITransaction>>;

  update(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null
  ): Promise<ITransaction>;
}
