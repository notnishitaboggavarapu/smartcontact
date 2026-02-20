import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Phone, Mail, Tag, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  "Printing & Branding",
  "Electronics",
  "Fashion & Apparel",
  "Food & Beverages",
  "Construction & Building",
  "Furniture & Decor",
  "Health & Beauty",
  "Auto & Transport",
  "Agriculture",
  "Professional Services",
  "Other",
];

const BusinessRegistrationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.name.trim() || !form.description.trim() || !form.category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("businesses").insert({
      owner_id: user.id,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
    });
    setIsSubmitting(false);

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Business registered!", description: "You can now manage your business from the dashboard." });
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
    }
  };

  return (
    <Card className="shadow-card border-0 max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Register Your Business</CardTitle>
        <CardDescription>
          Tell us about your business to start receiving quote requests from customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Tag className="h-4 w-4" /> Business Information
            </h3>
            <div className="space-y-2">
              <Label htmlFor="biz-name">Business Name *</Label>
              <Input
                id="biz-name"
                placeholder="e.g. Premium Print Solutions"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="biz-desc">Description *</Label>
              <Textarea
                id="biz-desc"
                placeholder="Describe what your business offers..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                required
                maxLength={500}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Phone className="h-4 w-4" /> Contact Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biz-phone">Phone</Label>
                <Input
                  id="biz-phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  maxLength={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-email">Business Email</Label>
                <Input
                  id="biz-email"
                  type="email"
                  placeholder="contact@yourbusiness.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  maxLength={255}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </h3>
            <div className="space-y-2">
              <Label htmlFor="biz-address">Street Address</Label>
              <Input
                id="biz-address"
                placeholder="123 Business Ave"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                maxLength={200}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="biz-city">City</Label>
                <Input
                  id="biz-city"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biz-state">State / Province</Label>
                <Input
                  id="biz-state"
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Business"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessRegistrationForm;
