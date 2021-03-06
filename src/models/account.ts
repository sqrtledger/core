export interface IAccount {
  availableBalance: number;

  balance: number;

  label: string;

  metadata: { [key: string]: string | null };

  name: string;

  reference: string;

  settings: {
    allowTransactions: boolean;
    allowCreditTransactions: boolean;
    allowDebitTransactions: boolean;
  };

  status: 'active' | 'inactive';
}
