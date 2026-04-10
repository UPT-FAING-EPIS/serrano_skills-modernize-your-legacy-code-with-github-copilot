'use strict';

const readlineSync = require('readline-sync');

const OPERATION_CODES = {
  TOTAL: 'TOTAL ',
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT ',
};

let storageBalance = 1000.0;

function resetBalance() {
  storageBalance = 1000.0;
}

function getBalance() {
  return storageBalance;
}

function dataProgram(operation, balance) {
  if (operation === 'READ') {
    return storageBalance;
  }

  if (operation === 'WRITE') {
    storageBalance = balance;
    return storageBalance;
  }

  return storageBalance;
}

function formatBalance(balance) {
  return Number(balance).toFixed(2);
}

function readAmount(io, label) {
  const input = io.question(label);
  const amount = Number.parseFloat(input);

  if (Number.isNaN(amount)) {
    io.log('Invalid amount. Transaction cancelled.');
    return null;
  }

  return amount;
}

function operations(operationType, io) {
  let finalBalance = 1000.0;

  if (operationType === OPERATION_CODES.TOTAL) {
    finalBalance = dataProgram('READ', finalBalance);
    io.log(`Current balance: ${formatBalance(finalBalance)}`);
    return;
  }

  if (operationType === OPERATION_CODES.CREDIT) {
    const amount = readAmount(io, 'Enter credit amount: ');
    if (amount === null) {
      return;
    }

    finalBalance = dataProgram('READ', finalBalance);
    finalBalance += amount;
    dataProgram('WRITE', finalBalance);
    io.log(`Amount credited. New balance: ${formatBalance(finalBalance)}`);
    return;
  }

  if (operationType === OPERATION_CODES.DEBIT) {
    const amount = readAmount(io, 'Enter debit amount: ');
    if (amount === null) {
      return;
    }

    finalBalance = dataProgram('READ', finalBalance);
    if (finalBalance >= amount) {
      finalBalance -= amount;
      dataProgram('WRITE', finalBalance);
      io.log(`Amount debited. New balance: ${formatBalance(finalBalance)}`);
      return;
    }

    io.log('Insufficient funds for this debit.');
  }
}

function createDefaultIO() {
  return {
    question: (prompt) => readlineSync.question(prompt),
    log: (message) => console.log(message),
  };
}

function main(io = createDefaultIO()) {
  let continueFlag = 'YES';

  while (continueFlag !== 'NO') {
    io.log('--------------------------------');
    io.log('Account Management System');
    io.log('1. View Balance');
    io.log('2. Credit Account');
    io.log('3. Debit Account');
    io.log('4. Exit');
    io.log('--------------------------------');

    const choiceInput = io.question('Enter your choice (1-4): ');
    const userChoice = Number.parseInt(choiceInput, 10);

    switch (userChoice) {
      case 1:
        operations(OPERATION_CODES.TOTAL, io);
        break;
      case 2:
        operations(OPERATION_CODES.CREDIT, io);
        break;
      case 3:
        operations(OPERATION_CODES.DEBIT, io);
        break;
      case 4:
        continueFlag = 'NO';
        break;
      default:
        io.log('Invalid choice, please select 1-4.');
    }
  }

  io.log('Exiting the program. Goodbye!');
}

if (require.main === module) {
  main();
}

module.exports = {
  OPERATION_CODES,
  dataProgram,
  formatBalance,
  operations,
  main,
  resetBalance,
  getBalance,
};
