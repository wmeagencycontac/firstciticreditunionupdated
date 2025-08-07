import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  UserCheck,
  CreditCard,
  DollarSign,
  Activity,
  LogOut,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { User, AdminPendingUsersResponse } from "@shared/api";
import { AdminActivityFeed } from "@/components/AdminActivityFeed";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface PendingUser {
  id: number;
  email: string;
  name: string;
  bio?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { profile: adminUser, signOut } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingUsers, setVerifyingUsers] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      // This would typically be a secure call to a serverless function
      // that verifies admin privileges before returning data.
      // For this example, we'll call a placeholder function.
      const { data, error: rpcError } = await supabase.rpc(
        "get_pending_users",
      );

      if (rpcError) {
        // Handle RLS errors, which might indicate not an admin
        if (rpcError.code === "42501") {
          setError("You do not have permission to view this data.");
          toast.error("Permission denied.");
        } else {
          throw rpcError;
        }
      }

      setPendingUsers(data || []);
    } catch (err) {
      console.error("Error fetching pending users:", err);
      setError("Failed to fetch pending users. Please try again.");
      toast.error("Could not load pending users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyUser = async (userId: number, userEmail: string) => {
    setVerifyingUsers((prev) => new Set([...prev, userId]));
    try {
      // This should also be a secure serverless function call
      const { error: rpcError } = await supabase.rpc("approve_user", {
        user_id_to_approve: userId,
      });

      if (rpcError) throw rpcError;

      toast.success(`User ${userEmail} verified successfully!`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error verifying user:", err);
      toast.error("Failed to verify user.");
    } finally {
      setVerifyingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Banking Administration Portal
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adminUser?.name}
                </p>
                <p className="text-xs text-gray-500">{adminUser?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Users
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Banking accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Transactions today
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Pending User Verifications</span>
              </CardTitle>
              <CardDescription>
                Users waiting for admin approval and banking account creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No pending users</p>
                  <p className="text-sm text-gray-400">
                    All users have been verified
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            {user.bio && (
                              <p className="text-xs text-gray-400 mt-1">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Registered: {formatDate(user.created_at)}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleVerifyUser(user.id, user.email)}
                        disabled={verifyingUsers.has(user.id)}
                        size="sm"
                        className="ml-4"
                      >
                        {verifyingUsers.has(user.id)
                          ? "Verifying..."
                          : "Approve"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Activity Feed */}
          <AdminActivityFeed />
        </div>
      </div>
    </div>
  );
}
