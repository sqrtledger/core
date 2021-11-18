<div id="top"></div>

![Contributors](https://img.shields.io/github/contributors/sqrtledger/core.svg?style=for-the-badge)
![Forks](https://img.shields.io/github/forks/sqrtledger/core.svg?style=for-the-badge)
![Stargazers](https://img.shields.io/github/stars/sqrtledger/core.svg?style=for-the-badge)
[![Issues](https://img.shields.io/github/issues/sqrtledger/core.svg?style=for-the-badge)](https://github.com/sqrtledger/core/issues)
![MIT License](https://img.shields.io/github/license/sqrtledger/core.svg?style=for-the-badge)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555)](https://www.linkedin.com/company/sqrtlabs)

<br />
<div align="center">
  <a href="https://github.com/sqrtledger/core">
    <img src="images/icon.png" alt="Icon" width="128" height="128" />
  </a>

  <h3 align="center">Sqrt Ledger Core</h3>

  <p align="center">
    The Open-Source API-First Ledger
    <br />
    <a href="https://github.com/sqrtledger/core">
      <strong>Explore the docs</strong>
    </a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

[![Illustration of a Wallet](images/undraw_wallet_aym5.jpg)](https://sqrtledger.com)

There are many great README templates available on GitHub; however, I didn't find one that really suited my needs so I created this enhanced one. I want to create a README template so amazing that it'll be the last one you ever need -- I think this is it.

Here's why:

- Your time should be focused on creating something amazing. A project that solves a problem and helps others
- You shouldn't be doing the same tasks over and over like creating a README from scratch
- You should implement DRY principles to the rest of your life :smile:

Of course, no one template will serve all projects since your needs may be different. So I'll be adding more in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue. Thanks to all the people have contributed to expanding this template!

Use the `BLANK_README.md` to get started.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Microsoft Azure](https://azure.microsoft.com/en-us)
- [Node.js](https://nodejs.org/en)
- [MongoDB](https://www.mongodb.com)
- [Redis](https://redis.io)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Installation

Use npm to install Sqrt Ledger Core:

- npm
  ```sh
  npm install sqrtledger-core@latest -- save
  ```

## Usage

```typescript
import {
  TransactionService,
  IAccountRepository,
  InMemoryAccountRepository,
  InMemoryTransactionRepository,
} from 'sqrtledger-core';

const accountRepository: IAccountRepository = new InMemoryAccountRepository();
const transactionRepository: ITransactionRepository =
  new InMemoryTransactionRepository();

const transactionService: TransactionService = new TransactionService(
  accountRepository,
  transactionRepository
);
```

<p align="right">(<a href="#top">back to top</a>)</p>

## Models

### Account View

```json
{
  "label": "All In One Current Account",
  "metadata": {
    "issuer": "Banco Santander"
  },
  "name": "Current Account",
  "reference": "EVoiVSfB"
}
```

### Account

```json
{
  "availableBalance": 10000,
  "balance": 10000,
  "label": "All In One Current Account",
  "metadata": {
    "issuer": "Banco Santander"
  },
  "name": "Current Account",
  "reference": "EVoiVSfB",
  "settings": {
    "allowTransactions": true,
    "allowCreditTransactions": true,
    "allowDebitTransactions": true
  },
  "status": "active"
}
```

### Card

```json
{
  "authorizationCode": "AUTH_gltaab334m",
  "bankIdentificationNumber": "408408",
  "expirationMonth": "12",
  "expirationYear": "2030",
  "last4Digits": "4081"
}
```

## Roadmap

- [x] Account Service
  - [x] Implement `create` Function
  - [x] Implement `delete` Function
  - [x] Implement `find` Function
- [x] Customer Service
  - [x] Implement `create` Function
  - [x] Implement `createOrUpdate` Function
  - [x] Implement `find` Function
  - [x] Implement `findAll` Function
- [ ] Transaction Service
  - [x] Implement `complete` Function
  - [x] Implement `create` Function
  - [x] Implement `createProcessComplete` Function
  - [ ] Implement `createProcessCompleteMultiple` Function
  - [x] Implement `fail` Function
  - [x] Implement `find` Function
  - [x] Implement `findAll` Function
  - [x] Implement `process` Function
- [x] Account Repository using MongoDB
  - [x] Implement `create` Function
  - [x] Implement `delete` Function
  - [x] Implement `find` Function
  - [x] Implement `updateAvailableBalance` Function
  - [x] Implement `updateBalance` Function
- [ ] Account Repository using Redis
  - [x] Implement `create` Function
  - [x] Implement `delete` Function
  - [x] Implement `find` Function
  - [x] Implement `updateAvailableBalance` Function
  - [x] Implement `updateBalance` Function

See the [open issues](https://github.com/sqrtledger/core/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Barend Erasmus - [@hirebarend](https://www.linkedin.com/in/hirebarend) - hirebarend@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>
