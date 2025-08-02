import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  EyeOff
} from "lucide-react";
import { DashboardData, Transaction } from "@shared/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("/api/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SecureBank</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>
                    {dashboardData.user.firstName[0]}{dashboardData.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">
                    {dashboardData.user.firstName} {dashboardData.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Welcome back
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Total Balance Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Balance</p>
                <div className="flex items-center space-x-2">
                  <h1 className="text-4xl font-bold">
                    {balanceVisible ? formatCurrency(dashboardData.totalBalance) : "••••••"}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button variant="secondary" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-primary-foreground/80 text-xs">This Month</p>
                <p className="text-lg font-semibold">
                  +{formatCurrency(dashboardData.accounts.reduce((sum, acc) => sum + acc.monthlyIncome, 0))}
                </p>
              </div>
              <div>
                <p className="text-primary-foreground/80 text-xs">Spent</p>
                <p className="text-lg font-semibold">
                  -{formatCurrency(dashboardData.accounts.reduce((sum, acc) => sum + acc.monthlySpending, 0))}
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
              <div className="space-y-4">
                {dashboardData.accounts.map((accountSummary) => (
                  <Card key={accountSummary.account.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            {accountSummary.account.accountType === "checking" ? (
                              <CreditCard className="w-5 h-5 text-primary" />
                            ) : accountSummary.account.accountType === "savings" ? (
                              <PiggyBank className="w-5 h-5 text-primary" />
                            ) : (
                              <TrendingUp className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold capitalize">
                              {accountSummary.account.accountType} Account
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {accountSummary.account.accountNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {balanceVisible ? formatCurrency(accountSummary.account.balance) : "••••••"}
                          </p>
                          <Badge variant={accountSummary.account.isActive ? "default" : "secondary"}>
                            {accountSummary.account.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Income</p>
                          <p className="font-semibold text-success">
                            +{formatCurrency(accountSummary.monthlyIncome)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Monthly Spending</p>
                          <p className="font-semibold text-destructive">
                            -{formatCurrency(accountSummary.monthlySpending)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Latest Transactions</CardTitle>
                <CardDescription>Your most recent account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          {getTransactionIcon(transaction)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.merchant} • {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${
                          transaction.amount > 0 ? "text-success" : "text-foreground"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/transactions" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
