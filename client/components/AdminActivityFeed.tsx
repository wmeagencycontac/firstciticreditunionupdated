import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity,
  UserPlus,
  UserCheck,
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { AdminAlertEvent } from "@shared/api";

interface ActivityItem extends AdminAlertEvent {
  id: string;
}

export function AdminActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io({
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Admin connected to socket");
      setIsConnected(true);
      // Join admin room for receiving admin-specific events
      newSocket.emit("join-admin-room");
    });

    newSocket.on("disconnect", () => {
      console.log("Admin disconnected from socket");
      setIsConnected(false);
    });

    // Listen for admin alerts
    newSocket.on("admin-alert", (alertData: AdminAlertEvent) => {
      console.log("Received admin alert:", alertData);
      const activityItem: ActivityItem = {
        ...alertData,
        id: `${Date.now()}-${Math.random()}`,
      };
      
      setActivities(prev => [activityItem, ...prev.slice(0, 49)]); // Keep last 50 items
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const getActivityIcon = (type: AdminAlertEvent["type"]) => {
    switch (type) {
      case "user-registered":
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "user-verified":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "account-created":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      case "transaction-added":
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case "balance-updated":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadgeColor = (type: AdminAlertEvent["type"]) => {
    switch (type) {
      case "user-registered":
        return "bg-blue-100 text-blue-800";
      case "user-verified":
        return "bg-green-100 text-green-800";
      case "account-created":
        return "bg-purple-100 text-purple-800";
      case "transaction-added":
        return "bg-yellow-100 text-yellow-800";
      case "balance-updated":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return "Just now";
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Live Activity Feed</span>
          <div className="flex items-center space-x-2 ml-auto">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Real-time banking system activity and user events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">Activity will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                    >
                      {activity.type.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.message}
                  </p>
                  {activity.userEmail && (
                    <p className="text-xs text-gray-500 mt-1">
                      User: {activity.userName || activity.userEmail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activities.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Showing {activities.length} recent activities
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
