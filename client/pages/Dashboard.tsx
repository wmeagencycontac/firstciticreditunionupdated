import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
  PiggyBank,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  db,
  realtimeManager,
  Account,
  Transaction,
  BankingUser,
} from "@/lib/supabase";

export default function Dashboard() {
  const { user, profile: bankingProfile, signOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadDashboardData(user.id);
      setupRealtimeSubscriptions(user.id);
    }
  }, [user]);

  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    // This effect is now empty, we can remove it.
  }, [recentTransactions]);

  const loadDashboardData = async (userId: string) => {
    setLoading(true);
    try {
      // Load accounts
      const { data: accountsData, error: accountsError } =
        await db.getAccounts(userId);
      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // Load recent transactions
      const { data: transactionsData, error: transactionsError } =
        await db.getTransactions(userId, undefined, 10);
      if (transactionsError) throw transactionsError;
      setRecentTransactions(transactionsData || []);

      // Load dashboard summary
      const { data: summaryData, error: summaryError } =
        await db.getDashboardSummary(userId);
      if (summaryError) throw summaryError;
      setTotalBalance(summaryData.totalBalance);
      setSpendingData(summaryData.spendingData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = (userId: string) => {
    // Subscribe to real-time transaction updates
    realtimeManager.subscribeToTransactions(userId, (payload) => {
      console.log("Real-time transaction update:", payload);
      const newTransaction = payload.new as Transaction;
      setRecentTransactions((prev) => [newTransaction, ...prev]);
    });

    // Subscribe to real-time account updates
    realtimeManager.subscribeToAccounts(userId, (payload) => {
      console.log("Real-time account update:", payload);
      const updatedAccount = payload.new as Account;
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account,
        ),
      );
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === "credit") {
      return <ArrowDownRight className="w-4 h-4 text-success" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-destructive" />;
  };

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case "checking":
        return <CreditCard className="w-5 h-5 text-primary" />;
      case "savings":
        return <PiggyBank className="w-5 h-5 text-primary" />;
      default:
        return <TrendingUp className="w-5 h-5 text-primary" />;
    }
  };

  const getUserInitials = () => {
    if (bankingProfile?.name) {
      const names = bankingProfile.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`;
      }
      return names[0][0];
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-8">
        <div className="text-center">
          <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Fusion Bank</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/notifications">
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">
                    {bankingProfile?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Welcome back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {bankingProfile?.name?.split(" ")[0]}!
          </h1>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to="/transfers">
                <Send className="w-4 h-4 mr-2" />
                New Transfer
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/deposit">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Deposit
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/pay-bills">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Bills
              </Link>
            </Button>
          </div>
        </div>

        {/* Show notice if no accounts exist */}
        {accounts.length === 0 && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have any accounts yet. Visit{" "}
              <Link
                to="/supabase-test"
                className="text-primary hover:underline"
              >
                /supabase-test
              </Link>{" "}
              to create your first account and start banking with us!
            </AlertDescription>
          </Alert>
        )}

        {/* Total Balance Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-foreground/80 text-sm">
                  Total Balance
                </p>
                <div className="flex items-center space-x-2">
                  <h1 className="text-4xl font-bold">
                    {balanceVisible
                      ? formatCurrency(totalBalance)
                      : "••••••"}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {balanceVisible ? (
                      <EyeOff className="w-4 w-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/supabase-test">
                    <Plus className="w-4 h-4 mr-2" />
                    Manage
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/supabase-test">
                    <Send className="w-4 h-4 mr-2" />
                    Transfer
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-primary-foreground/80 text-xs">Accounts</p>
                <p className="text-lg font-semibold">{accounts.length}</p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-xs">
                  Recent Transactions
                </p>
                <p className="text-lg font-semibold">
                  {recentTransactions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Accounts */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Accounts</h2>
              {accounts.length > 0 ? (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <Card
                      key={account.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {getAccountTypeIcon(account.account_type)}
                            </div>
                            <div>
                              <h3 className="font-semibold capitalize">
                                {account.account_type} Account
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {account.account_number}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              {balanceVisible
                                ? formatCurrency(account.balance)
                                : "••••••"}
                            </p>
                            <Badge variant="default">Active</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Currency</p>
                            <p className="font-semibold">{account.currency}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-semibold">
                              {formatDate(account.created_at)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Accounts Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first account to start banking with us
                    </p>
                    <Button asChild>
                      <Link to="/supabase-test">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Account
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Latest Transactions</CardTitle>
                <CardDescription>
                  Your most recent account activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                            {getTransactionIcon(transaction)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(transaction.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold text-sm ${
                              transaction.type === "credit"
                                ? "text-success"
                                : "text-foreground"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No transactions yet
                    </p>
                  </div>
                )}
                <Link to="/supabase-test" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    {recentTransactions.length > 0
                      ? "View All Transactions"
                      : "Start Banking"}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Spending Breakdown</CardTitle>
                <CardDescription>
                  Your spending by category for the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={spendingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
