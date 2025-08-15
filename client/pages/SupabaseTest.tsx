import React, { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Database,
  User,
  CreditCard,
  ArrowRightLeft,
} from "lucide-react";
import {
  auth,
  db,
  realtimeManager,
  Account,
  Transaction,
  Card as CardType,
  BankingUser,
  isSupabaseConfigured,
} from "@/lib/supabase";

export default function SupabaseTest() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [bankingProfile, setBankingProfile] = useState<BankingUser | null>(
    null,
  );

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"savings" | "checking">(
    "checking",
  );
  const [transferAmount, setTransferAmount] = useState("");
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  // Status messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // Development mode: Set mock user when Supabase is not configured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.log("Development mode: Setting mock user");
      const mockUser = {
        id: "dev-user-1",
        email: "dev@example.com",
        access_token: "dev-token",
      };
      setUser(mockUser);
      setBankingProfile({
        id: "dev-profile-1",
        user_id: "dev-user-1",
        name: "Development User",
        email: "dev@example.com",
        phone_number: "+1-555-0123",
        address_street: "123 Dev Street",
        address_city: "DevCity",
        address_state: "DevState",
        address_zip: "12345",
        date_of_birth: "1990-01-01",
        ssn: "***-**-1234",
        identity_verified: true,
        verification_method: "development",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Load some mock data for development
      setAccounts([
        {
          id: "dev-account-1",
          user_id: "dev-user-1",
          account_number: "1234567890",
          account_type: "checking",
          balance: 1500.00,
          currency: "USD",
          created_at: new Date().toISOString(),
        },
        {
          id: "dev-account-2",
          user_id: "dev-user-1",
          account_number: "0987654321",
          account_type: "savings",
          balance: 5000.00,
          currency: "USD",
          created_at: new Date().toISOString(),
        }
      ]);

      setCards([
        {
          id: "dev-card-1",
          user_id: "dev-user-1",
          card_number: "****-****-****-1234",
          status: "active",
          created_at: new Date().toISOString(),
        }
      ]);

      setMessage("Development mode: Mock user loaded");
      setMessageType("success");
    }
  }, []);

  useEffect(() => {
    // Check for existing user session
    auth.getUser().then(({ user }) => {
      if (user) {
        setUser(user);
        loadUserData(user.id);
        setupRealtimeSubscriptions(user.id);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
        setupRealtimeSubscriptions(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAccounts([]);
        setTransactions([]);
        setCards([]);
        setBankingProfile(null);
        realtimeManager.unsubscribeAll();
      }
    });

    return () => {
      subscription.unsubscribe();
      realtimeManager.unsubscribeAll();
    };
  }, []);

  const setupRealtimeSubscriptions = (userId: string) => {
    // Subscribe to real-time transaction updates
    realtimeManager.subscribeToTransactions(userId, (payload) => {
      console.log("Real-time transaction update:", payload);
      setMessage(`Real-time update: ${payload.eventType} transaction`);
      setMessageType("success");
      // Reload transactions to get the latest data
      loadTransactions(userId);
    });

    // Subscribe to real-time account updates
    realtimeManager.subscribeToAccounts(userId, (payload) => {
      console.log("Real-time account update:", payload);
      setMessage(`Real-time update: Account balance changed`);
      setMessageType("success");
      // Reload accounts to get the latest data
      loadAccounts(userId);
    });
  };

  const loadUserData = async (userId: string) => {
    await Promise.all([
      loadBankingProfile(userId),
      loadAccounts(userId),
      loadTransactions(userId),
      loadCards(userId),
    ]);
  };

  const loadBankingProfile = async (userId: string) => {
    const { data, error } = await db.getBankingProfile(userId);
    if (error) {
      console.error("Error loading banking profile:", error);
    } else {
      setBankingProfile(data);
    }
  };

  const loadAccounts = async (userId: string) => {
    const { data, error } = await db.getAccounts(userId);
    if (error) {
      console.error("Error loading accounts:", error);
    } else {
      setAccounts(data || []);
    }
  };

  const loadTransactions = async (userId: string) => {
    const { data, error } = await db.getTransactions(userId, undefined, 10);
    if (error) {
      console.error("Error loading transactions:", error);
    } else {
      setTransactions(data || []);
    }
  };

  const loadCards = async (userId: string) => {
    const { data, error } = await db.getCards(userId);
    if (error) {
      console.error("Error loading cards:", error);
    } else {
      setCards(data || []);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, name);
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("Sign up successful! Check your email for verification.");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Sign up failed");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("Sign in successful!");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Sign in failed");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await auth.signOut();
      if (error) {
        setMessage(error.message);
        setMessageType("error");
      } else {
        setMessage("Signed out successfully");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("Sign out failed");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleCreateAccount = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/supabase/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          accountType,
          initialBalance: 1000,
        }),
      });

      if (response.ok) {
        setMessage("Account created successfully!");
        setMessageType("success");
        await loadAccounts(user.id);
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to create account");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to create account");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleCreateCard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Development mode: Create a mock card
        const newCard = {
          id: `dev-card-${Date.now()}`,
          user_id: user.id,
          card_number: `****-****-****-${Math.floor(1000 + Math.random() * 9000)}`,
          status: "active",
          created_at: new Date().toISOString(),
        };
        setCards(prev => [...prev, newCard]);
        setMessage("Card created successfully! (Development mode)");
        setMessageType("success");
      } else {
        // Use SQLite API endpoint when Supabase is not configured
        const endpoint = "/api/cards";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token || 'dev-token'}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setMessage(result.message || "Card created successfully!");
          setMessageType("success");
          await loadCards(user.id);
        } else {
          const error = await response.json();
          setMessage(error.error || "Failed to create card");
          setMessageType("error");
        }
      }
    } catch (error) {
      setMessage("Failed to create card");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleTransfer = async () => {
    if (!user || !fromAccountId || !toAccountId || !transferAmount) {
      setMessage("Please fill in all transfer fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/supabase/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          fromAccountId: parseInt(fromAccountId),
          toAccountId: parseInt(toAccountId),
          amount: parseFloat(transferAmount),
          description: "Test transfer",
        }),
      });

      if (response.ok) {
        setMessage("Transfer completed successfully!");
        setMessageType("success");
        await loadUserData(user.id);
        setTransferAmount("");
      } else {
        const error = await response.json();
        setMessage(error.error || "Transfer failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Transfer failed");
      setMessageType("error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Integration Test
          </h1>
          <p className="text-gray-600">
            Test your banking application's Supabase integration
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <Card
            className={`${messageType === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {messageType === "error" ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span
                  className={
                    messageType === "error" ? "text-red-800" : "text-green-800"
                  }
                >
                  {message}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {!user ? (
          /* Authentication Forms */
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sign Up
                </CardTitle>
                <CardDescription>Create a new account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sign In
                </CardTitle>
                <CardDescription>Sign in to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* User Dashboard */
          <div className="space-y-8">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Profile
                  </div>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-gray-600">
                      {bankingProfile?.name || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Role</Label>
                    <Badge variant="secondary">
                      {bankingProfile?.role || "user"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Email Verified
                    </Label>
                    <Badge
                      variant={
                        bankingProfile?.email_verified
                          ? "default"
                          : "destructive"
                      }
                    >
                      {bankingProfile?.email_verified
                        ? "Verified"
                        : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Management */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Accounts ({accounts.length})
                  </CardTitle>
                  <CardDescription>Manage your bank accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <select
                      value={accountType}
                      onChange={(e) =>
                        setAccountType(e.target.value as "savings" | "checking")
                      }
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                    <Button onClick={handleCreateAccount} disabled={loading}>
                      Create Account
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {accounts.map((account) => (
                      <div key={account.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {account.account_type.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600">
                              {account.account_number}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${account.balance.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {account.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Cards ({cards.length})
                  </CardTitle>
                  <CardDescription>Manage your cards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleCreateCard} disabled={loading}>
                    Create New Card
                  </Button>

                  <div className="space-y-2">
                    {cards.map((card) => (
                      <div key={card.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{card.card_number}</p>
                            <p className="text-sm text-gray-600">
                              Created:{" "}
                              {new Date(card.created_at).toLocaleDateString()}
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
            </div>

            {/* Transfer and Transactions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="h-5 w-5" />
                    Transfer Funds
                  </CardTitle>
                  <CardDescription>
                    Transfer between your accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {accounts.length >= 2 ? (
                    <>
                      <div>
                        <Label>From Account</Label>
                        <select
                          value={fromAccountId}
                          onChange={(e) => setFromAccountId(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select account</option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.account_type.toUpperCase()} -{" "}
                              {account.account_number} ($
                              {account.balance.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>To Account</Label>
                        <select
                          value={toAccountId}
                          onChange={(e) => setToAccountId(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="">Select account</option>
                          {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.account_type.toUpperCase()} -{" "}
                              {account.account_number} ($
                              {account.balance.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0.01"
                        />
                      </div>
                      <Button
                        onClick={handleTransfer}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? "Processing..." : "Transfer Funds"}
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-600">
                      Create at least 2 accounts to transfer funds
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    Recent Transactions ({transactions.length})
                  </CardTitle>
                  <CardDescription>Latest account activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}$
                              {transaction.amount.toFixed(2)}
                            </p>
                            <Badge
                              variant={
                                transaction.type === "credit"
                                  ? "default"
                                  : "destructive"
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
        )}
      </div>
    </div>
  );
}
