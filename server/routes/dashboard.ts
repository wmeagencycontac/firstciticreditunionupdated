import { RequestHandler } from "express";
import { supabase } from "../supabase";

export const getDashboardSummary: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("balance")
      .eq("user_id", userId);

    if (accountsError) {
      throw accountsError;
    }

    // Calculate total balance
    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0,
    );

    // Get recent transactions
    const { data: recentTransactions, error: transactionsError } =
      await supabase
        .from("transactions")
        .select("*, accounts!inner(user_id)")
        .eq("accounts.user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(100);

    if (transactionsError) {
      throw transactionsError;
    }

    // Calculate spending data
    const spendingData = recentTransactions
      .filter((t) => t.type === "debit")
      .reduce(
        (acc, t) => {
          const category = (t as any).category || "Other";
          const existing = acc.find((item) => item.name === category);
          if (existing) {
            existing.amount += t.amount;
          } else {
            acc.push({ name: category, amount: t.amount });
          }
          return acc;
        },
        [] as { name: string; amount: number }[],
      );

    res.json({
      totalBalance,
      spendingData,
    });
  } catch (error) {
    console.error("Error loading dashboard summary:", error);
    res
      .status(500)
      .json({ error: "Failed to load dashboard summary" });
  }
};
