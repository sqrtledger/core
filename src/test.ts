import * as MongoDb from 'mongodb';
import * as Uuid from 'uuid';
import {
  IAccountRepository,
  InMemoryTransactionRepository,
  ITransactionRepository,
  MongoDbAccountRepository,
  TransactionService,
} from '.';

(async () => {
  const mongoClient = await MongoDb.MongoClient.connect('');

  const db = mongoClient.db('sqrtledger');

  const collection = db.collection('accounts');

  const accountRepository: IAccountRepository = new MongoDbAccountRepository(
    collection
  );

  const transactionRepository: ITransactionRepository =
    new InMemoryTransactionRepository();

  const transactionService: TransactionService = new TransactionService(
    accountRepository,
    transactionRepository
  );

  // await accountRepository.create({
  //   availableBalance: 1000,
  //   balance: 1000,
  //   label: 'Current Account',
  //   metadata: {
  //     country: 'Spain',
  //   },
  //   name: 'Current Account',
  //   reference: '827977177',
  //   settings: {
  //     allowCreditTransactions: true,
  //     allowDebitTransactions: true,
  //     allowTransactions: true,
  //   },
  //   status: 'active',
  // });

  await Promise.all([
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
    execute(1, transactionService),
  ]);

  console.log(await accountRepository.find('827977177'));

  await mongoClient.close();
})();

async function execute(n: number, transactionService: TransactionService) {
  try {
    await sleep();

    const result1 = await transactionService.create(
      '827977177',
      100,
      Uuid.v4(),
      {},
      '603915804',
      'debit'
    );

    await sleep();

    const result2 = await transactionService.process(
      result1.account,
      result1.transaction
    );

    await sleep();

    const result3 = await transactionService.complete(
      result2.account,
      result2.transaction
    );
  } catch (error: any) {
    console.log(`${n}: ${error.message}`);
  }
}

async function sleep() {
  const timeout = Math.floor(Math.random() * 300 + 100);

  await new Promise((resolve) => setTimeout(resolve, timeout));
}
