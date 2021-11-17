import { IAccount } from './account';
import { ICard } from './card';
import { ICustomerView } from './customer-view';

export interface ITransaction {
  amount: number;

  account: IAccount;

  card: ICard | null;

  collectionReference: string;

  customer: ICustomerView | null;

  metadata: { [key: string]: string | null };

  reference: string;

  status: 'created' | 'processed' | 'completed' | 'failed';

  timestamp: number;
}
