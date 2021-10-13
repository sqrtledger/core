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
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (account.availableBalance < 0) {
      await this.accountRepository.updateAvailableBalance(
        transaction.amount * -1,
        account.reference
      );

      throw new Error('insufficient available balance');
    }

    if (account.balance + transaction.amount < 0) {
      await this.accountRepository.updateAvailableBalance(
        transaction.amount * -1,
        account.reference
      );

      throw new Error('insufficient balance');
    }

    return {
      account: await this.accountRepository.updateBalance(
        transaction.amount,
        account.reference
      ),
      transaction: await this.transactionRepository.update(account, {
        ...transaction,
        status: 'completed',
      }),
    };
  }

  public async create(
    accountReference: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string },
    reference: string,
    type: string // credit, debit
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (!amount || amount < 0) {
      throw new Error('invalid amount');
    }

    if (!metadata) {
      throw new Error('invalid metadata');
    }

    if (type !== 'credit' && type !== 'debit') {
      throw new Error('invalid type');
    }

    const account: IAccount | null = await this.accountRepository.find(
      accountReference
    );

    if (!account) {
      throw new Error('account not found');
    }

    if (!account.settings.allowTransactions) {
      throw new Error('transactions not allowed');
    }

    if (type === 'credit' && !account.settings.allowCreditTransactions) {
      throw new Error('credit transactions not allowed');
    }

    if (type === 'debit' && !account.settings.allowDebitTransactions) {
      throw new Error('debit transactions not allowed');
    }

    return {
      account,
      transaction: await this.transactionRepository.create(account, {
        amount: type === 'credit' ? amount : type === 'debit' ? amount * -1 : 0,
        collectionReference,
        metadata,
        reference,
        status: 'created',
      }),
    };
  }

  public async createProcessComplete(
    accountReference: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string },
    reference: string,
    type: string // credit, debit
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    const resultCreate = await this.create(
      accountReference,
      amount,
      collectionReference,
      metadata,
      reference,
      type
    );

    const resultProcess = await this.process(
      resultCreate.account,
      resultCreate.transaction
    );

    const resultComplete = await this.complete(
      resultProcess.account,
      resultProcess.transaction
    );

    return resultComplete;
  }

  public async createProcessCompleteMultiple(
    requests: Array<{
      accountReference: string;
      amount: number;
      collectionReference: string;
      metadata: { [key: string]: string };
      reference: string;
      type: string; // credit, debit
    }>
  ): Promise<Array<{ account: IAccount; transaction: ITransaction }>> {
    const resultsCreate: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    for (const request of requests) {
      const resultCreate = await this.create(
        request.accountReference,
        request.amount,
        request.collectionReference,
        request.metadata,
        request.reference,
        request.type
      );

      resultsCreate.push(resultCreate);
    }

    const resultsProcess: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    for (const resultCreate of resultsCreate) {
      const resultProcess = await this.process(
        resultCreate.account,
        resultCreate.transaction
      );

      resultsProcess.push(resultProcess);
    }

    const resultsComplete: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    for (const resultProcess of resultsProcess) {
      const resultComplete = await this.complete(
        resultProcess.account,
        resultProcess.transaction
      );

      resultsComplete.push(resultComplete);
    }

    return resultsComplete;
  }

  public async fail(
    account: IAccount,
    transaction: ITransaction
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    return {
      account,
      transaction,
    };
  }

  public async process(
    account: IAccount,
    transaction: ITransaction
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (account.availableBalance + transaction.amount < 0) {
      throw new Error('insufficient available balance');
    }

    return {
      account: await this.accountRepository.updateAvailableBalance(
        transaction.amount,
        account.reference
      ),
      transaction: await this.transactionRepository.update(account, {
        ...transaction,
        status: 'processed',
      }),
    };
  }
}
