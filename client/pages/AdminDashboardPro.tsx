import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  DollarSign,
  FileText,
  Search,
  Filter,
  Download,
  Settings,
  AlertTriangle,
  Clock,
  UserCheck,
  Activity,
  Banknote,
  Camera,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  kyc_status: "pending" | "in_review" | "approved" | "rejected";
  account_locked: boolean;
  role: "user" | "admin";
  created_at: string;
  last_login_at?: string;
  phoneNumber?: string;
  ssn?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  account_id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  timestamp: string;
  user_name?: string;
  account_number?: string;
}

interface KYCDocument {
  id: string;
  user_id: string;
  document_type: string;
  verification_status: string;
  uploaded_at: string;
  user_name?: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingKyc: number;
  totalTransactions: number;
  totalBalance: number;
  dailyTransactions: number;
  lockedAccounts: number;
}

export default function AdminDashboardPro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingKyc: 0,
    totalTransactions: 0,
    totalBalance: 0,
    dailyTransactions: 0,
    lockedAccounts: 0,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [balanceUpdateDialog, setBalanceUpdateDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [newBalance, setNewBalance] = useState("");
  const [balanceReason, setBalanceReason] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all admin data
      await Promise.all([
        loadUsers(),
        loadAccounts(),
        loadTransactions(),
        loadKYCDocuments(),
        loadStats(),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await fetch("/api/admin/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions?limit=100", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    }
  };

  const loadKYCDocuments = async () => {
    try {
      const response = await fetch("/api/admin/kyc-documents?status=pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setKycDocuments(data.documents);
      }
    } catch (error) {
      console.error("Failed to load KYC documents:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/detailed`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data.user);
        setViewUserDialog(true);
      }
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };

  const handleKYCAction = async (
    documentId: string,
    action: "approve" | "reject",
    notes?: string,
  ) => {
    try {
      const response = await fetch(
        `/api/admin/kyc-documents/${documentId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ notes }),
        },
      );

      if (response.ok) {
        toast.success(`Document ${action}d successfully`);
        loadKYCDocuments();
        loadUsers();
      } else {
        toast.error(`Failed to ${action} document`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} document`);
    }
  };

  const handleLockUnlockUser = async (
    userId: string,
    action: "lock" | "unlock",
    reason?: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        toast.success(`User ${action}ed successfully`);
        loadUsers();
      } else {
        toast.error(`Failed to ${action} user`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedAccount || !newBalance || !balanceReason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/accounts/${selectedAccount.id}/balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            newBalance: parseFloat(newBalance),
            reason: balanceReason,
          }),
        },
      );

      if (response.ok) {
        toast.success("Balance updated successfully");
        setBalanceUpdateDialog(false);
        setNewBalance("");
        setBalanceReason("");
        setSelectedAccount(null);
        loadAccounts();
        loadStats();
      } else {
        toast.error("Failed to update balance");
      }
    } catch (error) {
      toast.error("Failed to update balance");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "locked" && user.account_locked) ||
      (statusFilter === "active" && !user.account_locked);
    const matchesKyc = kycFilter === "all" || user.kyc_status === kycFilter;

    return matchesSearch && matchesStatus && matchesKyc;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      in_review: { variant: "default" as const, label: "In Review" },
      approved: {
        variant: "default" as const,
        label: "Approved",
        className: "bg-green-100 text-green-800",
      },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      active: {
        variant: "default" as const,
        label: "Active",
        className: "bg-green-100 text-green-800",
      },
      suspended: { variant: "secondary" as const, label: "Suspended" },
      completed: {
        variant: "default" as const,
        label: "Completed",
        className: "bg-green-100 text-green-800",
      },
      failed: { variant: "destructive" as const, label: "Failed" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      variant: "secondary" as const,
      label: status,
    };
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00754A] rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">Fusion Bank</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.lockedAccounts} locked accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingKyc}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {stats.totalBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Transactions
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.dailyTransactions}
              </div>
              <p className="text-xs text-muted-foreground">Today's activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
            <TabsTrigger value="tools">Admin Tools</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and verification status
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={kycFilter} onValueChange={setKycFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All KYC</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>KYC Status</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getStatusBadge(user.kyc_status)}</TableCell>
                        <TableCell>
                          {user.account_locked ? (
                            <Badge variant="destructive">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          ) : (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              <Unlock className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewUser(user.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleLockUnlockUser(
                                  user.id,
                                  user.account_locked ? "unlock" : "lock",
                                )
                              }
                            >
                              {user.account_locked ? (
                                <Unlock className="w-3 h-3" />
                              ) : (
                                <Lock className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Manage user accounts and balances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Opened</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-mono">
                          {account.account_number}
                        </TableCell>
                        <TableCell>{account.account_type}</TableCell>
                        <TableCell>
                          $
                          {account.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          {new Date(account.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAccount(account);
                              setNewBalance(account.balance.toString());
                              setBalanceUpdateDialog(true);
                            }}
                          >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Edit Balance
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Monitor all platform transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">
                          {transaction.account_number}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "credit"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "credit" ? "+" : "-"}$
                          {transaction.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KYC Tab */}
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Document Verification</CardTitle>
                <CardDescription>
                  Review and approve user identity documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>{document.user_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {document.document_type === "selfie" ? (
                              <Camera className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                            {document.document_type.replace("_", " ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(document.verification_status)}
                        </TableCell>
                        <TableCell>
                          {new Date(document.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() =>
                                handleKYCAction(document.id, "approve")
                              }
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <XCircle className="w-3 h-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Document</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejecting this
                                    document.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Rejection reason..."
                                    id="rejection-reason"
                                  />
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      const textarea = document.getElementById(
                                        "rejection-reason",
                                      ) as HTMLTextAreaElement;
                                      handleKYCAction(
                                        document.id,
                                        "reject",
                                        textarea.value,
                                      );
                                    }}
                                  >
                                    Reject Document
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tools Tab */}
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Tools</CardTitle>
                  <CardDescription>
                    Administrative utilities and bulk operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Banknote className="w-4 h-4 mr-2" />
                    Bulk Transaction Import
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Export User Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Audit Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>
                    Monitor system health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Database Connection</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Encryption Service</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Processing</span>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Setup
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Email Service</span>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Viewing decrypted user information (Admin Access)
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <div className="font-medium">{selectedUser.name}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="font-medium">{selectedUser.email}</div>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <div className="font-medium">
                    {selectedUser.phoneNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <Label>SSN</Label>
                  <div className="font-medium">{selectedUser.ssn || "N/A"}</div>
                </div>
              </div>
              {selectedUser.address && (
                <div>
                  <Label>Address</Label>
                  <div className="font-medium">
                    {selectedUser.address.street}
                    <br />
                    {selectedUser.address.city}, {selectedUser.address.state}{" "}
                    {selectedUser.address.zipCode}
                  </div>
                </div>
              )}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This information is encrypted in the database and only
                  accessible to authorized administrators.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Balance Update Dialog */}
      <Dialog open={balanceUpdateDialog} onOpenChange={setBalanceUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Account Balance</DialogTitle>
            <DialogDescription>
              Manually adjust account balance with audit trail
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-balance">New Balance</Label>
              <Input
                id="new-balance"
                type="number"
                step="0.01"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="balance-reason">Reason for Change</Label>
              <Textarea
                id="balance-reason"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                placeholder="Enter reason for balance adjustment..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBalanceUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateBalance}>Update Balance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
