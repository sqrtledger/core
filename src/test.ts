import * as MongoDb from 'mongodb';
import * as Uuid from 'uuid';
import {
  IAccount,
  IAccountRepository,
  InMemoryAccountRepository,
  ITransactionRepository,
  MongoDbAccountRepository,
  MongoDbTransactionRepository,
  TransactionService,
} from '.';

(async () => {
  const mongoClient = await MongoDb.MongoClient.connect('');

  const db = mongoClient.db('sqrtledger');

  const collectionAccounts = db.collection('accounts');

  const collectionTransactions = db.collection('transactions');

  // const accountRepository: IAccountRepository = new MongoDbAccountRepository(
  //   collectionAccounts
  // );

  const accountRepository: IAccountRepository = new InMemoryAccountRepository();

  const transactionRepository: ITransactionRepository =
    new MongoDbTransactionRepository(collectionTransactions);

  const transactionService: TransactionService = new TransactionService(
    accountRepository,
    transactionRepository
  );

  const account: IAccount | null = await accountRepository.find(
    '827977177',
    null
  );

  if (!account) {
    await accountRepository.create(
      {
        availableBalance: 1000,
        balance: 1000,
        label: 'Current Account',
        metadata: {
          country: 'Spain',
        },
        name: 'Current Account',
        reference: '827977177',
        settings: {
          allowCreditTransactions: true,
          allowDebitTransactions: true,
          allowTransactions: true,
        },
        status: 'active',
      },
      null
    );
  }

  const timestamp1 = new Date().getTime();

  // await Promise.all([
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  //   execute(1, transactionService),
  // ]);

  const n = 10000;

  for (let i = 0; i < n; i++) {
    await execute(i, transactionService);
  }

  const timestamp2 = new Date().getTime();

  console.log(n / ((timestamp2 - timestamp1) / 1000));

  console.log(await accountRepository.find('827977177', null));

  await mongoClient.close();
})();

async function execute(n: number, transactionService: TransactionService) {
  try {
    // const result = await transactionService.full(
    //   '827977177',
    //   100,
    //   Uuid.v4(),
    //   {},
    //   Uuid.v4(),
    //   'debit'
    // );
  } catch (error: any) {
    console.log(`${n}: ${error.message}`);
  }
}
