export interface ITransaction {
  amount: number;

  collectionReference: string;

  metadata: { [key: string]: string };

  status: 'created' | 'processed' | 'completed' | 'failed';

  type: 'credit' | 'debit';
}
