import { IAccountRepository, ITransactionRepository } from '../interfaces';
import { IAccount, ICard, ICustomerView, ITransaction } from '../models';
import { TransactionValidator } from '../validators';

export class TransactionService {
  constructor(
    protected accountRepository: IAccountRepository,
    protected transactionRepository: ITransactionRepository
  ) {}

  public async complete(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null = null
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (account.availableBalance < 0) {
      await this.fail(account, transaction, tenantId);

      throw new Error('insufficient available balance');
    }

    if (account.balance + transaction.amount < 0) {
      await this.fail(account, transaction, tenantId);

      throw new Error('insufficient balance');
    }

    const transactionCompleted: ITransaction =
      await this.transactionRepository.update(
        account,
        {
          ...transaction,
          status: 'completed',
        },
        tenantId
      );

    const accountUpdated: IAccount = await this.accountRepository.updateBalance(
      transaction.amount,
      account.reference,
      tenantId
    );

    return {
      account: accountUpdated,
      transaction: transactionCompleted,
    };
  }

  public async create(
    accountReference: string,
    amount: number,
    card: ICard | null,
    collectionReference: string,
    customer: ICustomerView | null,
    metadata: { [key: string]: string | null },
    reference: string,
    type: 'credit' | 'debit',
    tenantId: string | null = null
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (amount < 0) {
      throw new Error('invalid amount');
    }

    // TODO: Validate Metadata

    const account: IAccount | null = await this.accountRepository.find(
      accountReference,
      tenantId
    );

    if (!account) {
      throw new Error('account not found');
    }

    const transaction: ITransaction = {
      amount: type === 'credit' ? amount : type === 'debit' ? amount * -1 : 0,
      account: {
        label: account.label,
        metadata: account.metadata,
        name: account.name,
        reference: account.reference,
      },
      card,
      collectionReference,
      customer,
      metadata,
      reference,
      status: 'created',
      timestamp: new Date().getTime(),
    };

    TransactionValidator.validate(transaction);

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
        transaction,
        tenantId
      ),
    };
  }

  public async createProcessComplete(
    accountReference: string,
    amount: number,
    card: ICard | null,
    collectionReference: string,
    customer: ICustomerView | null,
    metadata: { [key: string]: string | null },
    reference: string,
    type: 'credit' | 'debit',
    tenantId: string | null = null
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    let resultCreate: { account: IAccount; transaction: ITransaction } | null =
      null;

    try {
      resultCreate = await this.create(
        accountReference,
        amount,
        card,
        collectionReference,
        customer,
        metadata,
        reference,
        type,
        tenantId
      );
    } catch (error) {
      throw error;
    }

    let resultProcess: { account: IAccount; transaction: ITransaction } | null =
      null;

    try {
      resultProcess = await this.process(
        resultCreate.account,
        resultCreate.transaction,
        tenantId
      );
    } catch (error) {
      await this.fail(resultCreate.account, resultCreate.transaction, tenantId);

      throw error;
    }

    let resultComplete: {
      account: IAccount;
      transaction: ITransaction;
    } | null = null;

    try {
      resultComplete = await this.complete(
        resultProcess.account,
        resultProcess.transaction,
        tenantId
      );
    } catch (error) {
      await this.fail(
        resultProcess.account,
        resultProcess.transaction,
        tenantId
      );

      throw error;
    }

    return resultComplete;
  }

  public async createProcessCompleteMultiple(
    requests: Array<{
      accountReference: string;
      amount: number;
      card: ICard | null;
      collectionReference: string;
      customer: ICustomerView | null;
      metadata: { [key: string]: string | null };
      reference: string;
      type: 'credit' | 'debit';
    }>,
    tenantId: string | null = null
  ): Promise<Array<{ account: IAccount; transaction: ITransaction }>> {
    const resultsCreate: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    for (const request of requests) {
      const resultCreate = await this.create(
        request.accountReference,
        request.amount,
        request.card,
        request.collectionReference,
        request.customer,
        request.metadata,
        request.reference,
        request.type,
        tenantId
      );

      resultsCreate.push(resultCreate);
    }

    const resultsProcess: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    try {
      for (const resultCreate of resultsCreate) {
        const account: IAccount | null = await this.accountRepository.find(
          resultCreate.account.reference,
          tenantId
        );

        if (!account) {
          throw new Error();
        }

        const resultProcess = await this.process(
          account,
          resultCreate.transaction,
          tenantId
        );

        resultsProcess.push(resultProcess);
      }
    } catch (error) {
      // TODO

      throw error;
    }

    const resultsComplete: Array<{
      account: IAccount;
      transaction: ITransaction;
    }> = [];

    try {
      for (const resultProcess of resultsProcess) {
        const account: IAccount | null = await this.accountRepository.find(
          resultProcess.account.reference,
          tenantId
        );

        if (!account) {
          throw new Error();
        }

        const resultComplete = await this.complete(
          account,
          resultProcess.transaction,
          tenantId
        );

        resultsComplete.push(resultComplete);
      }
    } catch (error) {
      // TODO

      throw error;
    }

    return resultsComplete;
  }

  public async fail(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null = null
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (transaction.status === 'created') {
      const transactionFailed: ITransaction =
        await this.transactionRepository.update(
          account,
          {
            ...transaction,
            status: 'failed',
          },
          tenantId
        );

      return {
        account,
        transaction: transactionFailed,
      };
    }

    if (transaction.status === 'processed') {
      const transactionFailed: ITransaction =
        await this.transactionRepository.update(
          account,
          {
            ...transaction,
            status: 'failed',
          },
          tenantId
        );

      const accountUpdated: IAccount =
        await this.accountRepository.updateAvailableBalance(
          transaction.amount * -1,
          account.reference,
          tenantId
        );

      return {
        account: accountUpdated,
        transaction: transactionFailed,
      };
    }

    throw new Error('cannot fail transaction');
  }

  public async find(
    reference: string,
    tenantId: string | null = null
  ): Promise<ITransaction | null> {
    return await this.transactionRepository.find(reference, tenantId);
  }

  public async findAll(
    accountReference: string,
    tenantId: string | null = null
  ): Promise<Array<ITransaction>> {
    const account: IAccount | null = await this.accountRepository.find(
      accountReference,
      tenantId
    );

    if (!account) {
      throw new Error('account not found');
    }

    if (account.status !== 'active') {
      throw new Error('account not active');
    }

    return await this.transactionRepository.findAll(account, tenantId);
  }

  public async process(
    account: IAccount,
    transaction: ITransaction,
    tenantId: string | null = null
  ): Promise<{ account: IAccount; transaction: ITransaction }> {
    if (account.availableBalance + transaction.amount < 0) {
      throw new Error('insufficient available balance');
    }

    const transactionProcessed: ITransaction =
      await this.transactionRepository.update(
        account,
        {
          ...transaction,
          status: 'processed',
        },
        tenantId
      );

    const accountUpdated: IAccount =
      await this.accountRepository.updateAvailableBalance(
        transactionProcessed.amount,
        account.reference,
        tenantId
      );

    return {
      account: accountUpdated,
      transaction: transactionProcessed,
    };
  }
}
