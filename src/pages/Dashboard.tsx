import DashboardNav from "@/components/dashboard/DashboardNav";
import StatsCards from "@/components/dashboard/StatsCards";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import EmailNotifications from "@/components/dashboard/EmailNotifications";
import MessageList from "@/components/dashboard/MessageList";
import QuickActions from "@/components/dashboard/QuickActions";
import BusinessQuoteManagement from "@/components/dashboard/BusinessQuoteManagement";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-primary bg-clip-text text-transparent">Business Owner</span>
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your customer communications today.</p>
        </div>
        <StatsCards />
        <BusinessQuoteManagement />
        <AnalyticsDashboard />
        <EmailNotifications />
        <MessageList />
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
