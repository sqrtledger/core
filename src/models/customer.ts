import { ICard } from './card';

export interface ICustomer {
  cards: Array<ICard>;

  emailAddress: string;

  metadata: { [key: string]: string | null };

  name: string;
}
