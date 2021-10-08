import { IAccountRepository, ITransactionRepository } from '../interfaces';
import { ITransaction } from '../models';

export class TransactionService {
  constructor(
    protected accountRepository: IAccountRepository,
    protected transactionRepository: ITransactionRepository
  ) {}

  public async create(
    account: string,
    amount: number,
    collectionReference: string,
    metadata: { [key: string]: string },
    reference: string,
    type: string // credit, debit
  ): Promise<ITransaction | null> {
    // Validate amount

    // Validate metadata

    // Validate type

    // Check if account exist

    // Check account balance

    return null;
  }
}
