import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Mail, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Messages", value: "248", icon: MessageSquare, color: "text-primary" },
  { label: "Unread", value: "12", icon: Mail, color: "text-accent" },
  { label: "Avg Response Time", value: "2.3h", icon: Clock, color: "text-secondary" },
  { label: "This Month", value: "+23%", icon: TrendingUp, color: "text-primary" },
];

const StatsCards = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, index) => (
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

export default StatsCards;
