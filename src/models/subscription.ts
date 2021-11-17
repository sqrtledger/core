import { IAccountView } from './account-view';
import { ICard } from './card';
import { ICustomerView } from './customer-view';

export interface ISubscription {
  account: IAccountView;

  amount: number;

  card: ICard;

  customer: ICustomerView;

  description: string;

  endTimestamp: number | null;

  id: string;

  interval: 'daily' | 'weekly' | 'monthly' | 'biannually' | 'annually';

  metadata: { [key: string]: string | null };

  lastTimestamp: number;

  startTimestamp: number;
}
