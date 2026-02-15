import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const subject = (form.elements.namedItem("subject") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    // Insert message into database (no auth required via RLS)
    const { error } = await supabase.from("messages").insert({
      customer_name: name,
      customer_email: email,
      subject,
      message,
    });

    if (error) {
      toast({ title: "Failed to send message", description: error.message, variant: "destructive" });
    } else {
      // Send notification email via edge function
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "new_message",
            message_id: "",
            to_email: email,
            to_name: name,
            subject: `Message received: ${subject}`,
            body: `Hi ${name}, we've received your message "${subject}" and will get back to you shortly.`,
          },
        });
      } catch (err) {
        console.error("Notification error:", err);
      }

      toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });
      form.reset();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">ConnectHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost">Back to Home</Button></Link>
            <Link to="/auth"><Button variant="hero">Sign In</Button></Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Get in <span className="gradient-primary bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and our team will get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" placeholder="How can we help?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} required />
                    </div>
                    <Button type="submit" size="lg" variant="hero" className="w-full" disabled={isLoading}>
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-sm text-muted-foreground">support@connecthub.com</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office</h3>
                        <p className="text-sm text-muted-foreground">123 Business St.<br />San Francisco, CA 94105</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card gradient-hero p-6 text-white">
                <h3 className="font-bold text-xl mb-2">Need immediate help?</h3>
                <p className="text-white/90 mb-4 text-sm">Our support team is available 24/7 to assist you.</p>
                <Button variant="secondary" className="w-full">Start Live Chat</Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
