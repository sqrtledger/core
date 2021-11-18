import { IAccountView } from './account-view';
import { ICard } from './card';
import { ICustomerView } from './customer-view';

export interface ITransaction {
  amount: number;

  account: IAccountView;

  card: ICard | null;

  collectionReference: string;

  customer: ICustomerView | null;

  metadata: { [key: string]: string | null };

  reference: string;

  status: 'created' | 'processed' | 'completed' | 'failed';

  timestamp: number;
}
