export interface ITransaction {
  amount: number;

  collectionReference: string;

  metadata: { [key: string]: string | null };

  reference: string;

  status: 'created' | 'processed' | 'completed' | 'failed';

  timestamp: number;
}
