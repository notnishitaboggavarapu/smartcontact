import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Clock, CheckCircle, XCircle, DollarSign, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: number;
  customization_details: string | null;
  deadline: string | null;
  status: string;
  created_at: string;
  business_id: string;
  businesses?: { name: string };
  quote_responses?: QuoteResponse[];
}

interface QuoteResponse {
  id: string;
  price_estimate: number;
  message: string | null;
  valid_until: string | null;
  created_at: string;
}

interface Order {
  id: string;
  final_price: number;
  status: string;
  created_at: string;
  businesses?: { name: string };
  quote_requests?: { product_name: string };
}

const MyQuotes = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [quotesRes, ordersRes] = await Promise.all([
      supabase
        .from("quote_requests")
        .select("*, businesses(name), quote_responses(*)")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("*, businesses(name), quote_requests(product_name)")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);
    setQuotes((quotesRes.data || []) as unknown as QuoteRequest[]);
    setOrders((ordersRes.data || []) as unknown as Order[]);
    setLoading(false);
  };

  const acceptQuote = async (quoteRequestId: string, response: QuoteResponse, businessId: string) => {
    const { error: orderError } = await supabase.from("orders").insert({
      quote_request_id: quoteRequestId,
      quote_response_id: response.id,
      customer_id: user!.id,
      business_id: businessId,
      final_price: response.price_estimate,
    });

    if (orderError) {
      toast({ title: "Failed to accept quote", description: orderError.message, variant: "destructive" });
      return;
    }

    await supabase.from("quote_requests").update({ status: "accepted" }).eq("id", quoteRequestId);
    toast({ title: "Quote accepted!", description: "Your order has been placed." });
    fetchData();
  };

  const statusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
      pending: { variant: "outline", icon: Clock },
      quoted: { variant: "secondary", icon: DollarSign },
      accepted: { variant: "default", icon: CheckCircle },
      declined: { variant: "destructive", icon: XCircle },
      confirmed: { variant: "default", icon: CheckCircle },
      in_progress: { variant: "secondary", icon: Clock },
      completed: { variant: "default", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <Badge variant={c.variant} className="gap-1">
        <Icon className="h-3 w-3" /> {status.replace("_", " ")}
      </Badge>
    );
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Please sign in to view your quotes</p>
        <Link to="/auth"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">ConnectHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/marketplace"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Marketplace</Button></Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            My <span className="gradient-primary bg-clip-text text-transparent">Quotes & Orders</span>
          </h1>
          <p className="text-muted-foreground">Track your quote requests and orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="quotes">
            <TabsList>
              <TabsTrigger value="quotes">Quote Requests ({quotes.length})</TabsTrigger>
              <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="quotes" className="space-y-4 mt-4">
              {quotes.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">No quote requests yet</p>
                  <Link to="/marketplace"><Button>Browse Marketplace</Button></Link>
                </Card>
              ) : (
                quotes.map((q) => (
                  <Card key={q.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{q.product_name}</CardTitle>
                          <CardDescription>
                            {(q as any).businesses?.name} · Qty: {q.quantity} · {new Date(q.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {statusBadge(q.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {q.customization_details && (
                        <p className="text-sm"><span className="font-medium">Details:</span> {q.customization_details}</p>
                      )}
                      {q.deadline && (
                        <p className="text-sm"><span className="font-medium">Deadline:</span> {new Date(q.deadline).toLocaleDateString()}</p>
                      )}

                      {/* Quote responses */}
                      {q.quote_responses && q.quote_responses.length > 0 && (
                        <div className="border-t pt-3 space-y-3">
                          <p className="font-medium text-sm">Price Estimate:</p>
                          {q.quote_responses.map((r) => (
                            <div key={r.id} className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-primary">${Number(r.price_estimate).toFixed(2)}</span>
                                {r.valid_until && (
                                  <span className="text-xs text-muted-foreground">Valid until {new Date(r.valid_until).toLocaleDateString()}</span>
                                )}
                              </div>
                              {r.message && <p className="text-sm text-muted-foreground">{r.message}</p>}
                              {q.status !== "accepted" && (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  className="w-full gap-2"
                                  onClick={() => acceptQuote(q.id, r, q.business_id)}
                                >
                                  <ShoppingCart className="h-4 w-4" /> Accept & Place Order
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.status === "pending" && (!q.quote_responses || q.quote_responses.length === 0) && (
                        <div className="flex items-center gap-2 text-sm text-accent border-t pt-3">
                          <Clock className="h-4 w-4" />
                          Waiting for business to respond...
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 mt-4">
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No orders yet</p>
                </Card>
              ) : (
                orders.map((o) => (
                  <Card key={o.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{(o as any).quote_requests?.product_name}</h4>
                        <p className="text-sm text-muted-foreground">{(o as any).businesses?.name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-xl font-bold text-primary">${Number(o.final_price).toFixed(2)}</p>
                        {statusBadge(o.status)}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default MyQuotes;
