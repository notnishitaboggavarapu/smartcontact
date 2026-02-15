import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MessageSquare, TrendingUp } from "lucide-react";

const QuickActions = () => (
  <div className="mt-8 grid md:grid-cols-3 gap-6">
    <Card className="shadow-card gradient-hero p-6 text-primary-foreground border-0 hover:scale-105 transition-transform">
      <User className="h-10 w-10 mb-4 opacity-90" />
      <h3 className="font-bold text-xl mb-2">Profile Settings</h3>
      <p className="opacity-80 text-sm mb-4">Update your business information and preferences</p>
      <Button variant="secondary" size="sm" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-primary-foreground/30">
        Manage Profile
      </Button>
    </Card>
    <Card className="shadow-card p-6 border-secondary/20 hover:border-secondary hover:scale-105 transition-all">
      <MessageSquare className="h-10 w-10 text-secondary mb-4" />
      <h3 className="font-bold text-xl mb-2">Message Templates</h3>
      <p className="text-muted-foreground text-sm mb-4">Create and manage response templates</p>
      <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
        View Templates
      </Button>
    </Card>
    <Card className="shadow-card p-6 border-accent/20 hover:border-accent hover:scale-105 transition-all">
      <TrendingUp className="h-10 w-10 text-accent mb-4" />
      <h3 className="font-bold text-xl mb-2">Analytics</h3>
      <p className="text-muted-foreground text-sm mb-4">View detailed reports and insights</p>
      <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
        View Reports
      </Button>
    </Card>
  </div>
);

export default QuickActions;
