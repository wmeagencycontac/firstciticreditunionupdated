import { RequestHandler } from "express";
import { supabase, supabaseAdmin } from "../supabase";
import { z } from "zod";
import { getEmailService } from "../email";

// Validation schemas
const createAccountSchema = z.object({
  accountType: z.enum(["savings", "checking"]),
  initialBalance: z.number().min(0).optional().default(0),
});

const transferSchema = z.object({
  fromAccountId: z.number(),
  toAccountId: z.number(),
  amount: z.number().min(0.01),
  description: z.string().min(1),
});

const transactionSchema = z.object({
  accountId: z.number(),
  type: z.enum(["credit", "debit"]),
  amount: z.number().min(0.01),
  description: z.string().min(1),
});

// Get user's accounts
export const getAccounts: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    const { data: accounts, error } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching accounts:", error);
      return res.status(500).json({ error: "Failed to fetch accounts" });
    }

    res.json(accounts);
  } catch (error) {
    console.error("Get accounts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new account
export const createAccount: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { accountType, initialBalance } = createAccountSchema.parse(req.body);

    // Generate account number
    const { data: accountNumber, error: genError } = await supabaseAdmin.rpc(
      "generate_account_number",
      {
        user_id_input: user.id,
        account_type_input: accountType,
      },
    );

    if (genError || !accountNumber) {
      console.error("Error generating account number:", genError);
      return res
        .status(500)
        .json({ error: "Failed to generate account number" });
    }

    // Create the account
    const { data: account, error: createError } = await supabaseAdmin
      .from("accounts")
      .insert({
        user_id: user.id,
        account_number: accountNumber,
        account_type: accountType,
        balance: initialBalance,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating account:", createError);
      return res.status(500).json({ error: "Failed to create account" });
    }

    // If initial balance > 0, create an initial credit transaction
    if (initialBalance > 0) {
      const { error: transactionError } = await supabaseAdmin
        .from("transactions")
        .insert({
          account_id: account.id,
          type: "credit",
          amount: initialBalance,
          description: "Initial deposit",
        });

      if (transactionError) {
        console.error("Error creating initial transaction:", transactionError);
      }
    }

    res.status(201).json(account);
  } catch (error) {
    console.error("Create account error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get transactions for user's accounts
export const getTransactions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { accountId, limit = 50 } = req.query;

    let query = supabaseAdmin
      .from("transactions")
      .select(
        `
        *,
        accounts!inner(user_id)
      `,
      )
      .eq("accounts.user_id", user.id)
      .order("timestamp", { ascending: false });

    if (accountId) {
      query = query.eq("account_id", parseInt(accountId as string));
    }

    query = query.limit(parseInt(limit as string));

    const { data: transactions, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    // Clean up the response to remove the accounts relation
    const cleanTransactions = transactions.map(
      ({ accounts, ...transaction }) => transaction,
    );

    res.json(cleanTransactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a transaction
export const createTransaction: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { accountId, type, amount, description } = transactionSchema.parse(
      req.body,
    );

    // Verify account ownership
    const { data: account, error: accountError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("id", accountId)
      .eq("user_id", user.id)
      .single();

    if (accountError || !account) {
      return res
        .status(404)
        .json({ error: "Account not found or access denied" });
    }

    // Check if debit amount exceeds balance
    if (type === "debit" && account.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Calculate new balance
    const newBalance =
      type === "credit" ? account.balance + amount : account.balance - amount;

    // Use a transaction to ensure data consistency
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .insert({
        account_id: accountId,
        type,
        amount,
        description,
      })
      .select()
      .single();

    if (transactionError) {
      console.error("Error creating transaction:", transactionError);
      return res.status(500).json({ error: "Failed to create transaction" });
    }

    // Update account balance
    const { error: updateError } = await supabaseAdmin
      .from("accounts")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating account balance:", updateError);
      return res
        .status(500)
        .json({ error: "Failed to update account balance" });
    }

    // Send email notification for the transaction
    try {
      const emailService = getEmailService();

      // Get user email from the user object
      const userEmail = user.email;

      if (userEmail) {
        // Determine email type
        let emailType: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
        if (type === 'credit') {
          emailType = description.toLowerCase().includes('transfer') ? 'transfer_in' : 'deposit';
        } else {
          emailType = description.toLowerCase().includes('transfer') ? 'transfer_out' : 'withdrawal';
        }

        await emailService.sendTransactionNotification(userEmail, {
          type: emailType,
          amount: amount,
          description,
          accountNumber: account.account_number,
          balance: newBalance,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (emailError) {
      console.error('Failed to send transaction email notification:', emailError);
      // Don't fail the transaction for email errors
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create transaction error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Transfer between accounts
export const transfer: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { fromAccountId, toAccountId, amount, description } =
      transferSchema.parse(req.body);

    if (fromAccountId === toAccountId) {
      return res
        .status(400)
        .json({ error: "Cannot transfer to the same account" });
    }

    // Verify both accounts exist and user has access to the source account
    const { data: fromAccount, error: fromError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("id", fromAccountId)
      .eq("user_id", user.id)
      .single();

    if (fromError || !fromAccount) {
      return res
        .status(404)
        .json({ error: "Source account not found or access denied" });
    }

    const { data: toAccount, error: toError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("id", toAccountId)
      .single();

    if (toError || !toAccount) {
      return res.status(404).json({ error: "Destination account not found" });
    }

    // Check sufficient funds
    if (fromAccount.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    // Create both transactions
    const transferDescription = `Transfer: ${description}`;

    const { data: debitTransaction, error: debitError } = await supabaseAdmin
      .from("transactions")
      .insert({
        account_id: fromAccountId,
        type: "debit",
        amount,
        description: transferDescription,
      })
      .select()
      .single();

    if (debitError) {
      console.error("Error creating debit transaction:", debitError);
      return res.status(500).json({ error: "Failed to create transfer" });
    }

    const { data: creditTransaction, error: creditError } = await supabaseAdmin
      .from("transactions")
      .insert({
        account_id: toAccountId,
        type: "credit",
        amount,
        description: transferDescription,
      })
      .select()
      .single();

    if (creditError) {
      console.error("Error creating credit transaction:", creditError);
      return res.status(500).json({ error: "Failed to create transfer" });
    }

    // Update both account balances
    const { error: fromUpdateError } = await supabaseAdmin
      .from("accounts")
      .update({
        balance: fromAccount.balance - amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fromAccountId);

    if (fromUpdateError) {
      console.error("Error updating source account:", fromUpdateError);
      return res
        .status(500)
        .json({ error: "Failed to update account balances" });
    }

    const { error: toUpdateError } = await supabaseAdmin
      .from("accounts")
      .update({
        balance: toAccount.balance + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", toAccountId);

    if (toUpdateError) {
      console.error("Error updating destination account:", toUpdateError);
      return res
        .status(500)
        .json({ error: "Failed to update account balances" });
    }

    res.status(201).json({
      message: "Transfer completed successfully",
      debitTransaction,
      creditTransaction,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's cards
export const getCards: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    const { data: cards, error } = await supabaseAdmin
      .from("cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching cards:", error);
      return res.status(500).json({ error: "Failed to fetch cards" });
    }

    // Mask card numbers for security
    const maskedCards = cards.map((card) => ({
      ...card,
      card_number: `****-****-****-${card.card_number.slice(-4)}`,
    }));

    res.json(maskedCards);
  } catch (error) {
    console.error("Get cards error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new card
export const createCard: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    // Generate unique card number
    let cardNumber: string;
    let isUnique = false;

    do {
      const { data: generatedNumber, error: genError } =
        await supabaseAdmin.rpc("generate_card_number");

      if (genError || !generatedNumber) {
        console.error("Error generating card number:", genError);
        return res
          .status(500)
          .json({ error: "Failed to generate card number" });
      }

      cardNumber = generatedNumber;

      // Check if card number is unique
      const { data: existingCard, error: checkError } = await supabaseAdmin
        .from("cards")
        .select("id")
        .eq("card_number", cardNumber)
        .single();

      isUnique = checkError?.code === "PGRST116"; // No rows returned
    } while (!isUnique);

    // Create the card
    const { data: card, error: createError } = await supabaseAdmin
      .from("cards")
      .insert({
        user_id: user.id,
        card_number: cardNumber,
        status: "active",
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating card:", createError);
      return res.status(500).json({ error: "Failed to create card" });
    }

    // Mask card number in response
    const maskedCard = {
      ...card,
      card_number: `****-****-****-${card.card_number.slice(-4)}`,
    };

    res.status(201).json(maskedCard);
  } catch (error) {
    console.error("Create card error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Live transaction feed for dashboard
export const getRecentTransactions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data: transactions, error } = await supabaseAdmin
      .from("transactions")
      .select(
        `
        *,
        accounts!inner(user_id, account_number, account_type)
      `,
      )
      .eq("accounts.user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent transactions:", error);
      return res.status(500).json({ error: "Failed to fetch transactions" });
    }

    res.json(transactions);
  } catch (error) {
    console.error("Get recent transactions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
