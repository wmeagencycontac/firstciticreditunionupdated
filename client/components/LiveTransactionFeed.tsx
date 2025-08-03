import { Bell, ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@shared/api";
import { format } from "date-fns";

interface LiveTransactionFeedProps {
  transactions: Transaction[];
}

export default function LiveTransactionFeed({ transactions }: LiveTransactionFeedProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === "credit") {
      return <ArrowDownRight className="w-4 h-4 text-success" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-destructive" />;
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-4">
      <Card className="mb-4 border-success bg-success/5 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-success animate-pulse" />
            Live Transaction Updates
            <span className="text-sm font-normal text-muted-foreground">
              ({transactions.length} recent)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-2 bg-background rounded border transition-all duration-300 ${
                  index === 0 ? 'animate-slide-in border-success/30' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {getTransactionIcon(tx)}
                  <div>
                    <span className="font-medium text-sm">{tx.description}</span>
                    {tx.merchant && (
                      <p className="text-xs text-muted-foreground">{tx.merchant}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold text-sm ${
                      tx.amount > 0 ? "text-success" : "text-foreground"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-xs text-muted-foreground min-w-16 text-right">
                    {format(new Date(tx.createdAt), "HH:mm:ss")}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Real-time transaction feed • Updates automatically
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
