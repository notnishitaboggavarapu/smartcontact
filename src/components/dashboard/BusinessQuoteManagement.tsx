import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, CheckCircle, XCircle, Send, FileText, User, Package, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BusinessQuoteManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [priceEstimate, setPriceEstimate] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [validUntil, setValidUntil] = useState("");

  // Get businesses owned by this user
  const { data: businesses = [] } = useQuery({
    queryKey: ["my-businesses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("owner_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const businessIds = businesses.map((b) => b.id);

  // Get quote requests for all businesses owned by this user
  const { data: quoteRequests = [] } = useQuery({
    queryKey: ["business-quote-requests", businessIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*, businesses(name), quote_responses(*)")
        .in("business_id", businessIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: businessIds.length > 0,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ quoteRequestId, businessId }: { quoteRequestId: string; businessId: string }) => {
      // Create response
      const { error: respError } = await supabase.from("quote_responses").insert({
        quote_request_id: quoteRequestId,
        business_id: businessId,
        price_estimate: parseFloat(priceEstimate),
        message: responseMessage || null,
        valid_until: validUntil || null,
      });
      if (respError) throw respError;

      // Update request status
      const { error: updateError } = await supabase
        .from("quote_requests")
        .update({ status: "quoted" })
        .eq("id", quoteRequestId);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast({ title: "Response sent!", description: "The customer has been notified." });
      queryClient.invalidateQueries({ queryKey: ["business-quote-requests"] });
      setRespondingTo(null);
      setPriceEstimate("");
      setResponseMessage("");
      setValidUntil("");
    },
    onError: (err: any) => {
      toast({ title: "Failed to send response", description: err.message, variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (quoteRequestId: string) => {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status: "rejected" })
        .eq("id", quoteRequestId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Quote rejected" });
      queryClient.invalidateQueries({ queryKey: ["business-quote-requests"] });
    },
  });

  const pending = quoteRequests.filter((q) => q.status === "pending");
  const quoted = quoteRequests.filter((q) => q.status === "quoted");
  const accepted = quoteRequests.filter((q) => q.status === "accepted");

  const filtered = quoteRequests.filter(
    (q) =>
      q.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customization_details?.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (businesses.length === 0) {
    return (
      <Card className="shadow-card border-0">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold">No Business Registered</h3>
          <p className="text-muted-foreground">Register your business to start receiving quote requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Quote Requests</CardTitle>
            <CardDescription>Manage incoming quote requests from customers</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-accent/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-accent">{pending.length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">{quoted.length}</p>
            <p className="text-xs text-muted-foreground">Quoted</p>
          </div>
          <div className="bg-secondary/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{accepted.length}</p>
            <p className="text-xs text-muted-foreground">Accepted</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="quoted">Quoted ({quoted.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
            <TabsTrigger value="all">All ({quoteRequests.length})</TabsTrigger>
          </TabsList>

          {["pending", "quoted", "accepted", "all"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {(tab === "all" ? filtered : filtered.filter((q) => q.status === tab)).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No {tab === "all" ? "" : tab} quote requests</p>
                </div>
              ) : (
                (tab === "all" ? filtered : filtered.filter((q) => q.status === tab)).map((quote) => (
                  <Card key={quote.id} className="p-5 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-base">{quote.product_name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> Customer
                          </span>
                          <span>Qty: {quote.quantity}</span>
                          {quote.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(quote.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(quote.status)}
                    </div>

                    {quote.customization_details && (
                      <p className="text-sm text-muted-foreground mb-3 bg-muted/50 rounded p-3">
                        {quote.customization_details}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground mb-3">
                      Received: {new Date(quote.created_at).toLocaleString()}
                    </p>

                    {/* Show existing response */}
                    {(quote.quote_responses as any[])?.length > 0 && (
                      <div className="border-t border-l-4 border-l-primary pt-3 pl-4 mt-3 space-y-1">
                        {(quote.quote_responses as any[]).map((resp: any) => (
                          <div key={resp.id}>
                            <p className="text-sm font-semibold text-primary">
                              Your Quote: ${resp.price_estimate}
                            </p>
                            {resp.message && <p className="text-sm text-muted-foreground">{resp.message}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions for pending quotes */}
                    {quote.status === "pending" && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Dialog open={respondingTo === quote.id} onOpenChange={(open) => {
                          if (!open) setRespondingTo(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1" onClick={() => setRespondingTo(quote.id)}>
                              <Send className="h-4 w-4" /> Respond with Price
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Send Quote Response</DialogTitle>
                            </DialogHeader>
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                respondMutation.mutate({
                                  quoteRequestId: quote.id,
                                  businessId: quote.business_id,
                                });
                              }}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label>Price Estimate ($)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  required
                                  value={priceEstimate}
                                  onChange={(e) => setPriceEstimate(e.target.value)}
                                  placeholder="Enter your price"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Message (optional)</Label>
                                <Textarea
                                  value={responseMessage}
                                  onChange={(e) => setResponseMessage(e.target.value)}
                                  placeholder="Add details about your quote..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Valid Until (optional)</Label>
                                <Input
                                  type="date"
                                  value={validUntil}
                                  onChange={(e) => setValidUntil(e.target.value)}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button type="submit" className="flex-1" disabled={respondMutation.isPending}>
                                  {respondMutation.isPending ? "Sending..." : "Send Quote"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setRespondingTo(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() => rejectMutation.mutate(quote.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
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
  );
};

export default BusinessQuoteManagement;
