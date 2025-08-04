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
  type: "user-registered" | "user-verified" | "account-created" | "transaction-added" | "balance-updated";
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
    type: "transaction-alert",
    userId: transactionData.userId,
    userEmail: "",
    message: `Transaction: ${transactionData.type} $${transactionData.amount} - ${transactionData.description}`,
    timestamp: new Date().toISOString(),
  } as AdminAlertEvent);
}

export function emitBalanceUpdated(balanceData: BalanceUpdateEvent) {
  if (!io) return;

  // Emit to user's personal room
  io.to(`user:${balanceData.userId}`).emit("balance-updated", balanceData);
}

export function emitAccountCreated(accountData: AccountCreatedEvent) {
  if (!io) return;

  // Emit to user's personal room
  io.to(`user:${accountData.userId}`).emit("account-created", accountData);
}

export function emitAdminAlert(alertData: AdminAlertEvent) {
  if (!io) return;

  // Emit to admin room
  io.to("admin").emit("admin-alert", alertData);
}

export function emitUserVerified(userId: number, userEmail: string) {
  if (!io) return;

  const alertData: AdminAlertEvent = {
    type: "user-verified",
    userId,
    userEmail,
    message: `User ${userEmail} has been verified and banking accounts created`,
    timestamp: new Date().toISOString(),
  };

  emitAdminAlert(alertData);
}
