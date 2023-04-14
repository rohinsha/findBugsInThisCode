/** 19 && 112 
 * You have been contracted to work on a banking application. The company
 * that owns the application recently tried to add some new features to the 
 * application. There are some bugs in the implementations of the new  
 * features, and you have been asked to fix them. To make your job easier, 
 * the intended functionality of the application and its features have been
 * documented and a test suite is provided to verify the implementation. 

 * You can refer to the comments in the code to know which parts of the code
 * can be considered reliable and which parts might contain a bug.
**/

/**
 * Represents a bank. The bank contains accounts which are stored in a map
 * of unique id to account.
 */
class Bank {
  // --------------------------------------------------------------------
  // New features (potential bugs here)
  // --------------------------------------------------------------------
  /**
   * Pays interest to all accounts
   * Accounts earn 5% interest unless they have type
   * 'Savings', then they earn 10%
   *
   * @returns {number} total amount of interest paid
   */
  generateInterest() {
    let totalInterestPaid = 0;
    let interestRate = 0.05;

    for (const [id, account] of Object.entries(this.customerAccounts)) {
      if (account.type == "Savings") interestRate = 0.1;
      const accountInterest = account.getBalance() * interestRate;
      totalInterestPaid += accountInterest;

      account.setBalance(account.getBalance() + accountInterest);
    }

    return totalInterestPaid;
  }

  /**
   * Transfer money between two accounts
   * If a transfer request is invalid for any reason, it should do nothing
   *
   * @param {account} sourceAccount
   * @param {account} destAccount
   * @param {number} amountToTransfer
   */
  transfer(sourceAccount, destAccount, amountToTransfer) {
    if (!sourceAccount || !destAccount || amountToTransfer < 0) return;

    sourceAccount.setBalance(sourceAccount.getBalance() - amountToTransfer);
    destAccount.setBalance(destAccount.getBalance() + amountToTransfer);
  }

  /**
   * Transfers money between two users
   * If a transfer request is invalid for any reason, it should do nothing
   * Money can be pulled from any of the source user's accounts and will
   * deposited in one of the dest user's accounts
   *
   * @param {string} sourceUserId
   * @param {string} destUserId
   * @param {number} amountToTransfer
   */
  makePaymentBetweenUsers(sourceUserId, destUserId, amountToTransfer) {
    let availableBalance = 0;
    let destAccount;
    let sourceUserAccounts = [];

    for (const [id, acct] of Object.entries(this.customerAccounts)) {
      if (acct.userId == sourceUserId) {
        sourceUserAccounts.push(acct);
        availableBalance += acct.getBalance();
      }
      if (destAccount == null && acct.userId == destUserId) {
        destAccount = acct;
      }
    }

    if (availableBalance < amountToTransfer) return;

    for (const acct of sourceUserAccounts) {
      if (amountToTransfer <= 0) return;

      if (acct.getBalance() >= amountToTransfer) {
        this.transfer(acct, destAccount, amountToTransfer);
        return;
      } else {
        this.transfer(acct, destAccount, acct.getBalance());
        amountToTransfer -= acct.getBalance();
      }
    }
  }

  /**
   * Generates an id for a new account and inserts into customerAccounts
   *
   * @param account account to add to the bank
   * @return id of newly generated account
   */
  addAccount(account) {
    const maxCurrentAccountId = Object.keys(this.customerAccounts).length;
    const newAccountId = maxCurrentAccountId + 1;
    this.customerAccounts[newAccountId] = account;
    return newAccountId;
  }

  // --------------------------------------------------------------------
  // Existing functionality (no bugs past this point)
  // You should read this code to understand it, but you won't need to
  // modify anything here.
  // --------------------------------------------------------------------
  constructor(accounts) {
    // const defaultAccounts = {
    //   1: new Account('Ben123', 'Checking', 110),
    //   2: new Account('Ben123', 'Savings', 20),
    //   3: new Account('Ben123', 'Checking', 200),
    //   4: new Account('Amy456', 'Savings', 1000),
    // };

    this.customerAccounts = {};
    for (const [id, acct] of Object.entries(accounts)) {
      this.customerAccounts[id] = new Account(
        acct.userId,
        acct.type,
        acct.balance
      );
    }
  }

  /**
   * Deletes account by Id
   *
   * @param {string} accountId
   */
  deleteAccount(accountId) {
    delete this.customerAccounts[accountId];
  }

  /**
   * Gets account by Id
   *
   * @param accountId
   */
  getAccount(accountId) {
    return this.customerAccounts[accountId];
  }

  /**
   * Gets total balance from all accounts belonging to a user
   *
   * @param userId
   */
  getTotalUserBalance(userId) {
    let total = 0;
    for (const [id, acct] of Object.entries(this.customerAccounts)) {
      if (acct.userId === userId) total += acct.getBalance();
    }
    return total;
  }

  /**
   * Gets total balance of all customer accounts
   * @returns {number}
   */
  getTotalBankBalance() {
    let total = 0;
    for (const [id, acct] of Object.entries(this.customerAccounts)) {
      total += acct.getBalance();
    }

    return total;
  }
}

/**
 * Represents a bank account with userId, type, and balance
 * An account cannot have a negative balance
 */
class Account {
  constructor(userId, type, balance) {
    this.userId = userId;
    this.type = type;
    this.balance = balance;
  }

  /**
   * Sets balance of an account
   * Accounts cannot have a negative balance
   *
   * @param {account} account
   * @param {number}  balance
   */
  setBalance(balance) {
    if (balance >= 0) {
      this.balance = balance;
    }
  }

  /**
   * Gets balance of an account
   *
   * @param {account} account
   * @param {number}  balance
   */
  getBalance() {
    return this.balance;
  }
}

// --------------------------------------------------------------------
// Test Suite
// --------------------------------------------------------------------
const defaultAccounts = {
  1: new Account("Ben123", "Checking", 110),
  2: new Account("Ben123", "Savings", 20),
  3: new Account("Ben123", "Checking", 200),
  4: new Account("Amy456", "Savings", 1000)
};

// Bank should correctly calculate the amount of interest to pay to accounts
const testInterestPayments = () => {
  const b = new Bank(defaultAccounts);
  const expectedInterest = 0.05 * 110 + 0.1 * 20 + 0.05 * 200 + 0.1 * 1000;
  const actualInterest = b.generateInterest();

  if (actualInterest != expectedInterest) {
    console.log("Interest Payment Test Failed");
  } else {
    console.log("Interest Payment Test Passed!");
  }
};

// After making transfers between accounts, the total amount of
// money in the bank should remain the same
const testAccountTransfers = () => {
  const b = new Bank(defaultAccounts);
  const totalCustomerAccountsBalanceBeforeTransfers = b.getTotalBankBalance();
  const acct1 = b.getAccount(1);
  const acct2 = b.getAccount(2);
  b.transfer(acct1, acct2, 50);
  b.transfer(acct2, acct1, 200);
  b.transfer(acct1, acct2, 120);
  const totalCustomerAccountsBalanceAfterTransfers = b.getTotalBankBalance();

  if (
    totalCustomerAccountsBalanceBeforeTransfers !=
    totalCustomerAccountsBalanceAfterTransfers
  ) {
    console.log("Account Transfer Test Failed");
  } else {
    console.log("Account Transfer Test Passed!");
  }
};

// After making transfers between users, the total balance held by each user
// should have changed appropriately
const testUserTransfers = () => {
  const b = new Bank(defaultAccounts);
  const originalBenTotal = b.getTotalUserBalance("Ben123");
  const originalAmyTotal = b.getTotalUserBalance("Amy456");
  b.makePaymentBetweenUsers("Ben123", "Amy456", 10);
  b.makePaymentBetweenUsers("Ben123", "Amy456", 50);
  b.makePaymentBetweenUsers("Ben123", "Amy456", 230);
  const expectedBenTotalAfterTransfers = originalBenTotal - 10 - 50 - 230;
  const expectedAmyTotalAfterTransfers = originalAmyTotal + 10 + 50 + 230;
  const actualBenTotalAfterTransfers = b.getTotalUserBalance("Ben123");
  const actualAmyTotalAfterTransfers = b.getTotalUserBalance("Amy456");

  if (
    expectedBenTotalAfterTransfers !== actualBenTotalAfterTransfers ||
    expectedAmyTotalAfterTransfers !== actualAmyTotalAfterTransfers
  ) {
    console.log("User Transfer Test Failed");
  } else {
    console.log("User Transfer Test Passed!");
  }
};

// After creating and deleting an equal number of accounts,
// the total number of accounts should not have changed
const testAccountManagement = () => {
  const b = new Bank(defaultAccounts);
  const originalNumberOfAccounts = Object.keys(b.customerAccounts).length;
  b.addAccount(new Account("Cat789", "Checking", 100));
  b.deleteAccount("1");
  b.deleteAccount("2");
  b.addAccount(new Account("Dave012", "Savings", 2300));
  const finalNumberOfAccounts = Object.keys(b.customerAccounts).length;

  if (originalNumberOfAccounts !== finalNumberOfAccounts) {
    console.log("Account Management Test Failed");
  } else {
    console.log("Account Management Test Passed!");
  }
};

testInterestPayments();
testAccountTransfers();
testUserTransfers();
testAccountManagement();
