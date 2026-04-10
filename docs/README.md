# COBOL Student Account Documentation

This document explains the purpose of each COBOL file in this project, the key functions they implement, and the business rules currently applied to student accounts.

## System Overview

The application is a console-based student account management flow split into three COBOL programs:

- `main.cob`: user interaction and menu navigation.
- `operations.cob`: business operations (view balance, credit, debit).
- `data.cob`: account balance persistence in memory for the running session.

Together, they model a simple student account ledger with one active account balance.

## File-by-File Purpose

### `src/cobol/main.cob` (MainProgram)

Purpose:

- Runs the main menu loop.
- Accepts user choices.
- Delegates each requested action to `Operations`.

Key behavior:

- Displays options: View Balance, Credit Account, Debit Account, Exit.
- Uses operation codes when calling `Operations`:
  - `TOTAL ` for balance inquiry
  - `CREDIT` for credit operation
  - `DEBIT ` for debit operation
- Repeats until user chooses Exit.

### `src/cobol/operations.cob` (Operations)

Purpose:

- Implements account transaction logic.
- Coordinates reads/writes with `DataProgram`.

Key behavior:

- For `TOTAL `:
  - Reads current balance from `DataProgram` using `READ`.
  - Displays current balance.
- For `CREDIT`:
  - Requests credit amount.
  - Reads current balance.
  - Adds amount.
  - Writes updated balance with `WRITE`.
- For `DEBIT `:
  - Requests debit amount.
  - Reads current balance.
  - Validates sufficient funds.
  - Subtracts and writes updated balance if valid.
  - Displays insufficient funds message otherwise.

### `src/cobol/data.cob` (DataProgram)

Purpose:

- Acts as a lightweight data layer for account balance.
- Stores and returns the balance in a module-level variable.

Key behavior:

- `READ` operation returns the stored balance.
- `WRITE` operation replaces the stored balance.
- Maintains data only while the program session is running.

## Student Account Business Rules

The current implementation enforces the following rules:

1. Single account model
- The system manages one shared account balance at a time (no student ID selection).

2. Initial account balance
- The balance starts at `1000.00` for a new run.

3. Credits increase balance
- Any entered credit amount is added directly to the balance.

4. Debits require sufficient funds
- A debit is allowed only when current balance is greater than or equal to requested debit amount.
- If not, the transaction is rejected with an insufficient funds message.

5. In-session persistence only
- Balance updates are preserved only in memory during execution.
- Ending the program resets balance to the initial value on next run.

## Operational Notes and Limitations

- No validation currently prevents zero or negative transaction amounts.
- No per-student account records are modeled yet.
- No file/database persistence exists for long-term storage.
- Numeric precision is fixed to two decimal places via COBOL PIC definitions.

## Suggested Modernization Next Steps

- Add student identifiers so each student has an independent balance.
- Validate transaction inputs (positive, non-zero, numeric range checks).
- Persist balances to file or database.
- Add transaction history (timestamp, type, amount, resulting balance).
- Add audit and error logging for production scenarios.

## Sequence Diagram (Data Flow)

~~~mermaid
sequenceDiagram
  autonumber
  actor User
  participant Main as MainProgram (main.cob)
  participant Ops as Operations (operations.cob)
  participant Data as DataProgram (data.cob)

  User->>Main: Start app / choose menu option
  Main->>Main: Display menu loop (1-4)

  alt Option 1: View Balance
    Main->>Ops: CALL Operations("TOTAL ")
    Ops->>Data: CALL DataProgram("READ", FINAL-BALANCE)
    Data-->>Ops: Return STORAGE-BALANCE
    Ops-->>Main: Display current balance
    Main-->>User: Show balance result
  else Option 2: Credit Account
    Main->>Ops: CALL Operations("CREDIT")
    Ops-->>User: Request credit amount
    User-->>Ops: Input AMOUNT
    Ops->>Data: CALL DataProgram("READ", FINAL-BALANCE)
    Data-->>Ops: Return STORAGE-BALANCE
    Ops->>Ops: FINAL-BALANCE = FINAL-BALANCE + AMOUNT
    Ops->>Data: CALL DataProgram("WRITE", FINAL-BALANCE)
    Data->>Data: STORAGE-BALANCE = FINAL-BALANCE
    Data-->>Ops: Write acknowledged
    Ops-->>Main: Display new balance
    Main-->>User: Show credit confirmation
  else Option 3: Debit Account
    Main->>Ops: CALL Operations("DEBIT ")
    Ops-->>User: Request debit amount
    User-->>Ops: Input AMOUNT
    Ops->>Data: CALL DataProgram("READ", FINAL-BALANCE)
    Data-->>Ops: Return STORAGE-BALANCE
    alt Sufficient funds (FINAL-BALANCE >= AMOUNT)
      Ops->>Ops: FINAL-BALANCE = FINAL-BALANCE - AMOUNT
      Ops->>Data: CALL DataProgram("WRITE", FINAL-BALANCE)
      Data->>Data: STORAGE-BALANCE = FINAL-BALANCE
      Data-->>Ops: Write acknowledged
      Ops-->>Main: Display new balance
      Main-->>User: Show debit confirmation
    else Insufficient funds
      Ops-->>Main: Display insufficient funds message
      Main-->>User: Show rejected transaction
    end
  else Option 4: Exit
    Main->>Main: CONTINUE-FLAG = "NO"
    Main-->>User: Goodbye message
  end
~~~