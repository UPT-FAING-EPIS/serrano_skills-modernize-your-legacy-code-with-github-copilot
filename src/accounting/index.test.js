'use strict';

const { main, resetBalance } = require('./index');

function runMainWithInputs(inputs) {
  const outputs = [];
  let cursor = 0;

  const io = {
    question: () => {
      if (cursor >= inputs.length) {
        throw new Error('No more mocked inputs available.');
      }

      const value = inputs[cursor];
      cursor += 1;
      return String(value);
    },
    log: (message) => {
      outputs.push(String(message));
    },
  };

  main(io);
  return outputs;
}

function countOccurrences(lines, target) {
  return lines.filter((line) => line === target).length;
}

describe('COBOL parity test plan for Node.js accounting app', () => {
  beforeEach(() => {
    resetBalance();
  });

  test('TC-001: displays main menu on startup', () => {
    const outputs = runMainWithInputs(['4']);

    expect(outputs).toContain('Account Management System');
    expect(outputs).toContain('1. View Balance');
    expect(outputs).toContain('2. Credit Account');
    expect(outputs).toContain('3. Debit Account');
    expect(outputs).toContain('4. Exit');
  });

  test('TC-002: exits application from menu option 4', () => {
    const outputs = runMainWithInputs(['4']);

    expect(outputs).toContain('Exiting the program. Goodbye!');
  });

  test('TC-003: rejects invalid menu option and shows menu again', () => {
    const outputs = runMainWithInputs(['5', '4']);

    expect(outputs).toContain('Invalid choice, please select 1-4.');
    expect(countOccurrences(outputs, 'Account Management System')).toBe(2);
  });

  test('TC-004: shows initial balance in TOTAL operation', () => {
    const outputs = runMainWithInputs(['1', '4']);

    expect(outputs).toContain('Current balance: 1000.00');
  });

  test('TC-005: credits account with valid integer amount', () => {
    const outputs = runMainWithInputs(['2', '23', '1', '4']);

    expect(outputs).toContain('Amount credited. New balance: 1023.00');
    expect(outputs).toContain('Current balance: 1023.00');
  });

  test('TC-006: credits account with valid decimal amount', () => {
    const outputs = runMainWithInputs(['2', '10.50', '1', '4']);

    expect(outputs).toContain('Amount credited. New balance: 1010.50');
    expect(outputs).toContain('Current balance: 1010.50');
  });

  test('TC-007: debits account when funds are sufficient', () => {
    const outputs = runMainWithInputs(['3', '1', '1', '4']);

    expect(outputs).toContain('Amount debited. New balance: 999.00');
    expect(outputs).toContain('Current balance: 999.00');
  });

  test('TC-008: rejects debit when funds are insufficient', () => {
    const outputs = runMainWithInputs(['3', '1001', '1', '4']);

    expect(outputs).toContain('Insufficient funds for this debit.');
    expect(outputs).toContain('Current balance: 1000.00');
  });

  test('TC-009: preserves state across sequential operations in same run', () => {
    const outputs = runMainWithInputs(['2', '50', '3', '20', '1', '4']);

    expect(outputs).toContain('Current balance: 1030.00');
  });

  test('TC-010: resets balance on new application run', () => {
    runMainWithInputs(['2', '30', '4']);

    resetBalance();

    const outputs = runMainWithInputs(['1', '4']);
    expect(outputs).toContain('Current balance: 1000.00');
  });

  test('TC-011: handles boundary large credit amount consistently', () => {
    const outputs = runMainWithInputs(['2', '999999.99', '1', '4']);

    expect(outputs).toContain('Amount credited. New balance: 1000999.99');
    expect(outputs).toContain('Current balance: 1000999.99');
  });

  test('TC-012: allows debit equal to full available balance', () => {
    const outputs = runMainWithInputs(['3', '1000', '1', '4']);

    expect(outputs).toContain('Amount debited. New balance: 0.00');
    expect(outputs).toContain('Current balance: 0.00');
  });
});
