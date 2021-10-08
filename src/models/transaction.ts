export interface ITransaction {
  amount: number;

  collectionReference: string;

  status: 'initiating' | 'pending' | 'complete' | 'failed';
}
