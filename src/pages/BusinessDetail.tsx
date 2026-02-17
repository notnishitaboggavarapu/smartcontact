import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Star, MapPin, Phone, Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price_min: number;
  price_max: number;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [customization, setCustomization] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const [bizRes, prodRes, revRes] = await Promise.all([
      supabase.from("businesses").select("*").eq("id", id!).maybeSingle(),
      supabase.from("business_products").select("*").eq("business_id", id!).eq("is_available", true),
      supabase.from("reviews").select("*").eq("business_id", id!).order("created_at", { ascending: false }),
    ]);
    setBusiness(bizRes.data as Business | null);
    setProducts((prodRes.data || []) as Product[]);
    setReviews((revRes.data || []) as Review[]);
    setLoading(false);
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleQuoteSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in to request a quote.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    if (!selectedProduct) {
      toast({ title: "Select a product", variant: "destructive" });
      return;
    }
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      customer_id: user.id,
      business_id: id!,
      product_id: selectedProduct,
      product_name: product.name,
      quantity: parseInt(quantity) || 1,
      customization_details: customization || null,
      deadline: deadline || null,
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Failed to submit quote", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Quote requested!", description: "The business will respond with a price estimate." });
      setQuoteOpen(false);
      setSelectedProduct("");
      setQuantity("1");
      setCustomization("");
      setDeadline("");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? "text-accent fill-accent" : "text-muted"}`} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Business not found</p>
        <Link to="/marketplace"><Button>Back to Marketplace</Button></Link>
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
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Smart Contact</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/marketplace"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Marketplace</Button></Link>
            <Link to="/auth"><Button variant="outline" size="sm">Sign In</Button></Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Business Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{business.name}</h1>
              <Badge variant="secondary">{business.category}</Badge>
            </div>
            <p className="text-lg text-muted-foreground">{business.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {business.address}, {business.city}, {business.state}</span>
              {business.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {business.phone}</span>}
              {business.email && <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {business.email}</span>}
            </div>
            <div className="flex items-center gap-2">
              {renderStars(avgRating)}
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
            </div>
          </div>
          <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg" className="gap-2 shadow-elegant">
                <Send className="h-5 w-5" /> Request Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request a Quote from {business.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} (${p.price_min} - ${p.price_max})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Customization Details</Label>
                  <Textarea
                    placeholder="Describe your requirements (colors, sizes, design, etc.)"
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleQuoteSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products */}
        <Card>
          <CardHeader><CardTitle>Products & Services</CardTitle></CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-muted-foreground">No products listed</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <Card key={p.id} className="p-4 space-y-2 border">
                    <h4 className="font-semibold">{p.name}</h4>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{p.category}</Badge>
                      <span className="text-sm font-medium text-primary">
                        ${p.price_min} - ${p.price_max}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => { setSelectedProduct(p.id); setQuoteOpen(true); }}
                    >
                      Request Quote
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews yet</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="border-b last:border-0 pb-4 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {r.customer_name.charAt(0)}
                      </div>
                      <span className="font-medium">{r.customer_name}</span>
                    </div>
                    {renderStars(r.rating)}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDetail;
