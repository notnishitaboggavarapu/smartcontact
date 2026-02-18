import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Clock, CheckCircle, Search, ShoppingBag, Store, FileText, LogOut } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CustomerDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: quoteRequests = [] } = useQuery({
    queryKey: ["customer-quotes", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*, businesses(name, category), quote_responses(*)")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, businesses(name)")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/customer-auth" replace />;
  }

  const pendingQuotes = quoteRequests.filter((q) => q.status === "pending");
  const quotedQuotes = quoteRequests.filter((q) => q.status === "quoted");
  const acceptedQuotes = quoteRequests.filter((q) => q.status === "accepted");

  const filtered = quoteRequests.filter(
    (q) =>
      q.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.businesses as any)?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Pending</Badge>;
      case "quoted":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Quoted</Badge>;
      case "accepted":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Smart Connect
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden md:flex">Customer</Badge>
            <Link to="/marketplace">
              <Button variant="ghost" size="sm" className="gap-1">
                <Store className="h-4 w-4" /> Marketplace
              </Button>
            </Link>
            <Link to="/my-quotes">
              <Button variant="ghost" size="sm" className="gap-1">
                <FileText className="h-4 w-4" /> My Quotes
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome, <span className="gradient-primary bg-clip-text text-transparent">Customer</span>
          </h1>
          <p className="text-muted-foreground">Track your quotes, orders, and discover businesses</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Quotes", value: quoteRequests.length, icon: Send, color: "text-primary" },
            { label: "Pending", value: pendingQuotes.length, icon: Clock, color: "text-accent" },
            { label: "Quoted", value: quotedQuotes.length, icon: MessageSquare, color: "text-primary" },
            { label: "Orders", value: orders.length, icon: CheckCircle, color: "text-secondary" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-card border-0">
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

        {/* Quote Requests */}
        <Card className="shadow-card border-0 mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Your Quote Requests</CardTitle>
                <CardDescription>Track all your quote requests and responses</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({quoteRequests.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingQuotes.length})</TabsTrigger>
                <TabsTrigger value="quoted">Quoted ({quotedQuotes.length})</TabsTrigger>
                <TabsTrigger value="accepted">Accepted ({acceptedQuotes.length})</TabsTrigger>
              </TabsList>

              {["all", "pending", "quoted", "accepted"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {(tab === "all" ? filtered : filtered.filter((q) => q.status === tab)).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No quote requests found</p>
                      <Link to="/marketplace">
                        <Button variant="outline" className="mt-4">Browse Marketplace</Button>
                      </Link>
                    </div>
                  ) : (
                    (tab === "all" ? filtered : filtered.filter((q) => q.status === tab)).map((quote) => (
                      <Card key={quote.id} className="p-5 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h4 className="font-semibold text-base">{quote.product_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {(quote.businesses as any)?.name} · Qty: {quote.quantity}
                            </p>
                          </div>
                          {getStatusBadge(quote.status)}
                        </div>
                        {quote.customization_details && (
                          <p className="text-sm text-muted-foreground mb-2">{quote.customization_details}</p>
                        )}
                        {quote.deadline && (
                          <p className="text-xs text-muted-foreground">Deadline: {new Date(quote.deadline).toLocaleDateString()}</p>
                        )}
                        {/* Show response if quoted */}
                        {(quote.quote_responses as any[])?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-l-4 border-l-primary pl-4 space-y-2">
                            {(quote.quote_responses as any[]).map((resp: any) => (
                              <div key={resp.id}>
                                <p className="text-sm font-semibold text-primary">
                                  Price Estimate: ${resp.price_estimate}
                                </p>
                                {resp.message && <p className="text-sm text-muted-foreground">{resp.message}</p>}
                                {resp.valid_until && (
                                  <p className="text-xs text-muted-foreground">
                                    Valid until: {new Date(resp.valid_until).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {quote.status === "pending" && (
                          <div className="mt-3 pt-3 border-t flex items-center gap-2 text-accent">
                            <Clock className="h-4 w-4" />
                            <p className="text-sm">Waiting for business response...</p>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-elegant gradient-hero p-8 text-white border-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-2xl mb-2">Find what you need</h3>
              <p className="text-white/80">Browse the marketplace to discover businesses and request quotes</p>
            </div>
            <Link to="/marketplace">
              <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg">
                <Store className="mr-2 h-5 w-5" /> Browse Marketplace
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
