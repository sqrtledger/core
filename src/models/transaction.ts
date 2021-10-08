export interface ITransaction {
  amount: number;

  collectionReference: string;

  metadata: { [key: string]: string };

  reference: string;

  status: 'created' | 'processed' | 'completed' | 'failed';
}
