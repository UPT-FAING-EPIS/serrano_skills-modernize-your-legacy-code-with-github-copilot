# COBOL Account System - Business Test Plan

This test plan validates the current business logic and implementation behavior of the COBOL application before modernization to Node.js.

Scope covered:
- Main menu flow and navigation.
- Balance query.
- Credit operation.
- Debit operation (with and without enough funds).
- In-memory balance persistence during one program run.
- Balance reset when the application starts again.

Out of scope (current implementation gap):
- No explicit validation for non-numeric amount input is implemented in business logic.
- No explicit validation for zero amount operations is implemented in business logic.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | Display main menu on startup | Application compiled successfully. | 1. Run `./accountsystem`.<br>2. Observe first screen. | Menu is displayed with options 1 (View Balance), 2 (Credit Account), 3 (Debit Account), 4 (Exit). | TBD | TBD | Validate text and option numbering exactly as agreed by stakeholders. |
| TC-002 | Exit application from menu option 4 | Application is running at main menu. | 1. Enter `4`.<br>2. Observe output. | Program ends and prints `Exiting the program. Goodbye!`. | TBD | TBD | Confirms controlled termination path. |
| TC-003 | Reject invalid menu option | Application is running at main menu. | 1. Enter `5` (or any value outside 1-4).<br>2. Observe output. | Message `Invalid choice, please select 1-4.` is shown and menu is displayed again. | TBD | TBD | Validates `WHEN OTHER` branch behavior. |
| TC-004 | View initial balance (TOTAL operation) | Fresh application run (not used yet in current run). | 1. Enter `1` (View Balance).<br>2. Observe output. | Current balance is displayed as `001000.00` (initial balance). | TBD | TBD | Baseline business value at startup. |
| TC-005 | Credit account with valid integer amount | Application is running. Initial balance known (for example 1000.00). | 1. Enter `2` (Credit Account).<br>2. Enter amount `23`.<br>3. Enter `1` (View Balance). | Credit success message appears and balance increases by 23.00 (example: from 1000.00 to 1023.00). View Balance shows same updated value. | TBD | TBD | Validates read + add + write flow. |
| TC-006 | Credit account with valid decimal amount | Application is running. Initial balance known (for example 1000.00). | 1. Enter `2`.<br>2. Enter amount `10.50`.<br>3. Enter `1`. | Balance increases by 10.50 (example: from 1000.00 to 1010.50) and remains consistent on view. | TBD | TBD | Validates decimal handling with PIC `9(6)V99`. |
| TC-007 | Debit account when funds are sufficient | Application is running with balance at least 1.00. | 1. Enter `3` (Debit Account).<br>2. Enter amount `1`.<br>3. Enter `1` (View Balance). | Debit success message appears and balance decreases by 1.00. View Balance shows updated value. | TBD | TBD | Validates read + compare + subtract + write path. |
| TC-008 | Debit account when funds are insufficient | Application is running with known balance (example 1000.00). | 1. Enter `3`.<br>2. Enter amount greater than current balance (example `1001`).<br>3. Enter `1`. | Message `Insufficient funds for this debit.` is shown. Balance remains unchanged on next View Balance. | TBD | TBD | Validates insufficient-funds branch (no write expected). |
| TC-009 | Sequential operations preserve state during same run | Application is running from fresh start. | 1. Enter `2`, amount `50`.<br>2. Enter `3`, amount `20`.<br>3. Enter `1`. | Final balance equals initial +50 -20 (example: 1030.00). | TBD | TBD | Confirms in-memory state consistency across multiple operations. |
| TC-010 | Balance resets on new application run | Complete one run with changed balance, then restart app. | 1. In run A, perform a credit/debit so balance is not 1000.00.<br>2. Exit with option `4`.<br>3. Start app again (run B).<br>4. Enter `1`. | On run B, initial balance is again `001000.00`. | TBD | TBD | Confirms current persistence is runtime-memory only (no file/database persistence). |
| TC-011 | Boundary amount: maximum representable amount for credit | Fresh run recommended for controlled state. | 1. Enter `2`.<br>2. Enter `999999.99`.<br>3. Observe behavior and resulting balance display. | System accepts amount according to numeric field definition and processes operation consistently without crash. | TBD | TBD | Boundary test for amount field capacity. Validate business expectation for very large credits. |
| TC-012 | Boundary amount: debit full available balance | Application running with known balance (example 1000.00). | 1. Enter `3`.<br>2. Enter exact current balance (example `1000`).<br>3. Enter `1`. | Debit is accepted (`>=` condition). New balance becomes `000000.00`. | TBD | TBD | Confirms equality condition for debit rule. |

## Stakeholder Validation Notes

- During modernization to Node.js, preserve the same business outcomes for all passing test cases unless stakeholders approve rule changes.
- If new input-validation rules are introduced in Node.js (for example non-numeric/negative/zero handling), add new test cases and mark them as intentional behavior changes.
