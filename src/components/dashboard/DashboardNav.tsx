import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const DashboardNav = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">ConnectHub</span>
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden md:flex">Business Owner</Badge>
          <Button variant="ghost" size="sm">Settings</Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
