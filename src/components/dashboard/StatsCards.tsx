import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Mail, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StatsCards = () => {
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    thisMonth: 0,
    lastMonth: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: messages } = await supabase.from("messages").select("id, is_read, created_at");
      if (!messages) return;

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const total = messages.length;
      const unread = messages.filter((m) => !m.is_read).length;
      const thisMonth = messages.filter((m) => new Date(m.created_at) >= thisMonthStart).length;
      const lastMonth = messages.filter(
        (m) => new Date(m.created_at) >= lastMonthStart && new Date(m.created_at) < thisMonthStart
      ).length;

      setStats({ total, unread, thisMonth, lastMonth });
    };

    fetchStats();
  }, []);

  const growth = stats.lastMonth > 0 ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100) : 0;

  const statCards = [
    { label: "Total Messages", value: String(stats.total), icon: MessageSquare, color: "text-primary" },
    { label: "Unread", value: String(stats.unread), icon: Mail, color: "text-accent" },
    { label: "Avg Response Time", value: "2.3h", icon: Clock, color: "text-secondary" },
    { label: "This Month", value: `${growth >= 0 ? "+" : ""}${growth}%`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
