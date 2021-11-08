import { IAccountRepository, ITransactionRepository } from '../interfaces';
import { IAccount, ITransaction } from '../models';
import { TransactionValidator } from '..//validators';

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
      await this.fail(account, transaction);

      throw new Error('insufficient available balance');
    }

    if (account.balance + transaction.amount < 0) {
      await this.fail(account, transaction);

      throw new Error('insufficient balance');
    }

    const transactionCompleted: ITransaction =
      await this.transactionRepository.update(account, {
        ...transaction,
        status: 'completed',
      });

    const accountUpdated: IAccount = await this.accountRepository.updateBalance(
      transaction.amount,
      account.reference
    );

    return {
      account: accountUpdated,
      transaction: transactionCompleted,
    };
  }

  public async create(
    accountReference: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string | null },
    reference: string,
    type: 'credit' | 'debit'
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (amount < 0) {
      throw new Error('invalid amount');
    }

    // TODO: Validate Metadata

    const transaction: ITransaction = {
      amount: type === 'credit' ? amount : type === 'debit' ? amount * -1 : 0,
      collectionReference,
      metadata,
      reference,
      status: 'created',
      timestamp: new Date().getTime(),
    };

    TransactionValidator.validate(transaction);

    const account: IAccount | null = await this.accountRepository.find(
      accountReference
    );

    if (!account) {
      throw new Error('account not found');
    }

    if (account.status !== 'active') {
      throw new Error('account not active');
    }

    if (!account.settings.allowTransactions) {
      throw new Error('transactions not allowed');
    }

    if (transaction.amount > 0 && !account.settings.allowCreditTransactions) {
      throw new Error('credit transactions not allowed');
    }

    if (transaction.amount < 0 && !account.settings.allowDebitTransactions) {
      throw new Error('debit transactions not allowed');
    }

    return {
      account,
      transaction: await this.transactionRepository.create(
        account,
        transaction
      ),
    };
  }

  public async createProcessComplete(
    accountReference: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string | null },
    reference: string,
    type: 'credit' | 'debit'
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    let resultCreate: { account: IAccount; transaction: ITransaction } | null =
      null;

    try {
      resultCreate = await this.create(
        accountReference,
        amount,
        collectionReference,
        metadata,
        reference,
        type
      );
    } catch (error) {
      throw error;
    }

    let resultProcess: { account: IAccount; transaction: ITransaction } | null =
      null;

    try {
      resultProcess = await this.process(
        resultCreate.account,
        resultCreate.transaction
      );
    } catch (error) {
      await this.fail(resultCreate.account, resultCreate.transaction);

      throw error;
    }

    let resultComplete: {
      account: IAccount;
      transaction: ITransaction;
    } | null = null;

    try {
      resultComplete = await this.complete(
        resultProcess.account,
        resultProcess.transaction
      );
    } catch (error) {
      await this.fail(resultProcess.account, resultProcess.transaction);

      throw error;
    }

    return resultComplete;
  }

  public async createProcessCompleteMultiple(
    requests: Array<{
      accountReference: string;
      amount: number;
      collectionReference: string;
      metadata: { [key: string]: string | null };
      reference: string;
      type: 'credit' | 'debit';
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
      const account: IAccount | null = await this.accountRepository.find(
        resultCreate.account.reference
      );

      if (!account) {
        throw new Error();
      }

      const resultProcess = await this.process(
        account,
        resultCreate.transaction
      );

      resultsProcess.push(resultProcess);
    }

    const resultsComplete: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    for (const resultProcess of resultsProcess) {
      const account: IAccount | null = await this.accountRepository.find(
        resultProcess.account.reference
      );

      if (!account) {
        throw new Error();
      }

      const resultComplete = await this.complete(
        account,
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
    if (transaction.status === 'created') {
      const transactionFailed: ITransaction =
        await this.transactionRepository.update(account, {
          ...transaction,
          status: 'failed',
        });

      return {
        account,
        transaction: transactionFailed,
      };
    }

    if (transaction.status === 'processed') {
      const transactionFailed: ITransaction =
        await this.transactionRepository.update(account, {
          ...transaction,
          status: 'failed',
        });

      const accountUpdated: IAccount =
        await this.accountRepository.updateAvailableBalance(
          transaction.amount * -1,
          account.reference
        );

      return {
        account: accountUpdated,
        transaction: transactionFailed,
      };
    }

    throw new Error('cannot fail transaction');
  }

  public async find(reference: string): Promise<ITransaction | null> {
    return await this.transactionRepository.find(reference);
  }

  public async findAll(
    accountReference: string,
    filter: { [key: string]: number | string }
  ): Promise<Array<ITransaction>> {
    const account: IAccount | null = await this.accountRepository.find(
      accountReference
    );

    if (!account) {
      throw new Error('account not found');
    }

    if (account.status !== 'active') {
      throw new Error('account not active');
    }

    return await this.transactionRepository.findAll(account, filter);
  }

  public async process(
    account: IAccount,
    transaction: ITransaction
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (account.availableBalance + transaction.amount < 0) {
      throw new Error('insufficient available balance');
    }

    const transactionProcessed: ITransaction =
      await this.transactionRepository.update(account, {
        ...transaction,
        status: 'processed',
      });

    const accountUpdated: IAccount =
      await this.accountRepository.updateAvailableBalance(
        transactionProcessed.amount,
        account.reference
      );

    return {
      account: accountUpdated,
      transaction: transactionProcessed,
    };
  }
}
