import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  User,
  Plus,
  ArrowRightLeft,
  Wallet,
  TrendingUp,
} from "lucide-react";

interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: "checking" | "savings";
  balance: number;
  currency: string;
  created_at: string;
}

interface Card {
  id: string;
  user_id: string;
  card_number: string;
  status: "active" | "inactive";
  created_at: string;
}

interface Transaction {
  id: string;
  account_id: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  timestamp: string;
}

export default function DevBanking() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // Form states for account creation
  const [newAccountType, setNewAccountType] = useState<"checking" | "savings">(
    "checking",
  );

  useEffect(() => {
    // Initialize with mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockAccounts: Account[] = [
      {
        id: "acc-1",
        user_id: "dev-user",
        account_number: "1234567890",
        account_type: "checking",
        balance: 1500.0,
        currency: "USD",
        created_at: new Date().toISOString(),
      },
      {
        id: "acc-2",
        user_id: "dev-user",
        account_number: "0987654321",
        account_type: "savings",
        balance: 5000.0,
        currency: "USD",
        created_at: new Date().toISOString(),
      },
    ];

    const mockCards: Card[] = [
      {
        id: "card-1",
        user_id: "dev-user",
        card_number: "****-****-****-1234",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ];

    const mockTransactions: Transaction[] = [
      {
        id: "txn-1",
        account_id: "acc-1",
        amount: 50.0,
        type: "debit",
        description: "Coffee Shop Purchase",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "txn-2",
        account_id: "acc-2",
        amount: 1000.0,
        type: "credit",
        description: "Direct Deposit",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];

    setAccounts(mockAccounts);
    setCards(mockCards);
    setTransactions(mockTransactions);
    setMessage("Development banking interface loaded");
    setMessageType("success");
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      // Simulate account creation
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        user_id: "dev-user",
        account_number: Math.floor(
          1000000000 + Math.random() * 9000000000,
        ).toString(),
        account_type: newAccountType,
        balance: 0.0,
        currency: "USD",
        created_at: new Date().toISOString(),
      };

      setAccounts((prev) => [...prev, newAccount]);
      setMessage(
        `${newAccountType.charAt(0).toUpperCase() + newAccountType.slice(1)} account created successfully!`,
      );
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to create account");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleCreateCard = async () => {
    setLoading(true);
    try {
      // Simulate card creation
      const newCard: Card = {
        id: `card-${Date.now()}`,
        user_id: "dev-user",
        card_number: `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "active",
        created_at: new Date().toISOString(),
      };

      setCards((prev) => [...prev, newCard]);
      setMessage("Card created successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to create card");
      setMessageType("error");
    }
    setLoading(false);
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
      year: "numeric",
    });
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">
              Development Banking Interface
            </h1>
          </div>
          <p className="text-muted-foreground">
            Test banking features without authentication (Development Mode)
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <Alert variant={messageType === "error" ? "destructive" : "default"}>
            {messageType === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Wallet className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(getTotalBalance())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Accounts
                  </p>
                  <p className="text-2xl font-bold">{accounts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cards
                  </p>
                  <p className="text-2xl font-bold">{cards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Account Management */}
          <div className="space-y-6">
            {/* Create Account */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Account
                </CardTitle>
                <CardDescription>
                  Add a new checking or savings account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="account-type">Account Type</Label>
                  <select
                    id="account-type"
                    value={newAccountType}
                    onChange={(e) =>
                      setNewAccountType(
                        e.target.value as "checking" | "savings",
                      )
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                  </select>
                </div>
                <Button
                  onClick={handleCreateAccount}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </CardContent>
            </Card>

            {/* Accounts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Your Accounts ({accounts.length})
                </CardTitle>
                <CardDescription>Manage your bank accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold capitalize">
                            {account.account_type} Account
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {account.account_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {formatCurrency(account.balance)}
                          </p>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card Management */}
          <div className="space-y-6">
            {/* Create Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Cards ({cards.length})
                </CardTitle>
                <CardDescription>
                  Manage your debit/credit cards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCreateCard}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating..." : "Create New Card"}
                </Button>

                <div className="space-y-3">
                  {cards.map((card) => (
                    <div key={card.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{card.card_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Created: {formatDate(card.created_at)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            card.status === "active" ? "default" : "secondary"
                          }
                        >
                          {card.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <Badge
                            variant={
                              transaction.type === "credit"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
