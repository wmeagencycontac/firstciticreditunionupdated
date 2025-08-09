import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  DollarSign,
  CreditCard,
  Settings,
  Trash2
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "transaction",
      title: "Payment Received",
      message: "You received $250.00 from John Smith",
      time: "2 minutes ago",
      read: false,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "security",
      title: "Login from New Device",
      message: "New login detected from Chrome on Windows",
      time: "1 hour ago",
      read: false,
      icon: AlertCircle,
      color: "text-orange-600"
    },
    {
      id: 3,
      type: "account",
      title: "Monthly Statement Ready",
      message: "Your December statement is now available",
      time: "1 day ago",
      read: true,
      icon: Info,
      color: "text-blue-600"
    },
    {
      id: 4,
      type: "payment",
      title: "Credit Card Payment Due",
      message: "Payment of $89.50 due in 3 days",
      time: "2 days ago",
      read: false,
      icon: CreditCard,
      color: "text-red-600"
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Bell className="w-6 h-6 text-[#00754A]" />
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </div>
            </div>
            <Link to="/notifications/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                You're all caught up! Check back later for new updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    !notification.read ? "border-l-4 border-l-[#00754A] bg-blue-50/30" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full bg-gray-100 ${notification.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-sm font-semibold ${
                              !notification.read ? "text-gray-900" : "text-gray-700"
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#00754A] rounded-full"></div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/transactions">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  View Transactions
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </Link>
              <Link to="/security">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Security Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
