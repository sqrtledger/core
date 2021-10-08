import { IAccountRepository, ITransactionRepository } from '../interfaces';
import { IAccount, ITransaction } from '../models';

export class TransactionService {
  constructor(
    protected accountRepository: IAccountRepository,
    protected transactionRepository: ITransactionRepository
  ) {}

  public async complete(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction | null> {
    // Check account balance

    // Update account balance

    // Update transaction

    return null;
  }

  public async create(
    accountReference: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string },
    reference: string,
    type: string // credit, debit
  ): Promise<ITransaction | null> {
    if (!amount || amount < 0) {
      throw new Error('TODO');
    }

    // Validate metadata

    if (type !== 'credit' && type !== 'debit') {
      throw new Error('TODO');
    }

    const account: IAccount | null = await this.accountRepository.find(
      accountReference
    );

    if (!account) {
      throw new Error('TODO');
    }

    if (!account.settings.allowTransactions) {
      throw new Error('TODO');
    }

    if (type === 'credit' && !account.settings.allowCreditTransactions) {
      throw new Error('TODO');
    }

    if (type === 'debit' && !account.settings.allowDebitTransactions) {
      throw new Error('TODO');
    }

    const transaction: ITransaction = {
      amount,
      collectionReference,
      metadata,
      status: 'created',
      type,
    };

    await this.transactionRepository.create(account, transaction);

    return transaction;
  }

  public async process(
    account: IAccount,
    transaction: ITransaction
  ): Promise<ITransaction | null> {
    if (
      transaction.type === 'debit' &&
      account.availableBalance < transaction.amount
    ) {
      throw new Error('TODO');
    }

    // Update account available balance

    await this.transactionRepository.update(account, transaction);

    return null;
  }
}
