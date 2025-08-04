import { io } from "./index";

export interface TransactionEvent {
  transactionId: number;
  accountId: number;
  userId: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
}

export interface BalanceUpdateEvent {
  accountId: number;
  userId: number;
  newBalance: number;
  accountType: "savings" | "checking";
}

export interface AccountCreatedEvent {
  userId: number;
  accounts: {
    accountId: number;
    accountNumber: string;
    accountType: "savings" | "checking";
    balance: number;
  }[];
  cards: {
    cardId: number;
    cardNumber: string;
  }[];
}

export interface AdminAlertEvent {
  type:
    | "user-registered"
    | "user-verified"
    | "account-created"
    | "transaction-added"
    | "balance-updated";
  userId: number;
  userEmail?: string;
  userName?: string;
  message: string;
  timestamp: string;
  data?: any;
}

// Helper functions to emit events
export function emitTransactionAdded(transactionData: TransactionEvent) {
  if (!io) return;

  // Emit to user's personal room
  io.to(`user:${transactionData.userId}`).emit(
    "transaction-added",
    transactionData,
  );

  // Emit to admin room for monitoring
  io.to("admin").emit("admin-alert", {
    type: "transaction-added",
    userId: transactionData.userId,
    message: `Transaction: ${transactionData.type} $${transactionData.amount} - ${transactionData.description}`,
    timestamp: new Date().toISOString(),
    data: transactionData,
  } as AdminAlertEvent);
}

export function emitBalanceUpdated(balanceData: BalanceUpdateEvent) {
  if (!io) return;

  // Emit to user's personal room
  io.to(`user:${balanceData.userId}`).emit("balance-updated", balanceData);

  // Emit to admin room for monitoring
  io.to("admin").emit("admin-alert", {
    type: "balance-updated",
    userId: balanceData.userId,
    message: `Account balance updated: $${balanceData.newBalance} (${balanceData.accountType})`,
    timestamp: new Date().toISOString(),
    data: balanceData,
  } as AdminAlertEvent);
}

export function emitAccountCreated(accountData: AccountCreatedEvent) {
  if (!io) return;

  // Emit to user's personal room
  io.to(`user:${accountData.userId}`).emit("account-created", accountData);

  // Emit to admin room for monitoring
  io.to("admin").emit("admin-alert", {
    type: "account-created",
    userId: accountData.userId,
    message: `New banking accounts created for user (${accountData.accounts.length} accounts, ${accountData.cards.length} cards)`,
    timestamp: new Date().toISOString(),
    data: accountData,
  } as AdminAlertEvent);
}

export function emitAdminAlert(alertData: AdminAlertEvent) {
  if (!io) return;

  // Emit to admin room
  io.to("admin").emit("admin-alert", alertData);
}

export function emitUserVerified(
  userId: number,
  userEmail: string,
  userName?: string,
) {
  if (!io) return;

  const alertData: AdminAlertEvent = {
    type: "user-verified",
    userId,
    userEmail,
    userName,
    message: `User ${userName || userEmail} has been verified and banking accounts created`,
    timestamp: new Date().toISOString(),
  };

  emitAdminAlert(alertData);
}

export function emitUserRegistered(
  userId: number,
  userEmail: string,
  userName: string,
) {
  if (!io) return;

  const alertData: AdminAlertEvent = {
    type: "user-registered",
    userId,
    userEmail,
    userName,
    message: `New user registration: ${userName} (${userEmail})`,
    timestamp: new Date().toISOString(),
  };

  emitAdminAlert(alertData);
}
