import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, MessageSquare, BarChart3, Shield, Zap, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroIllustration from "@/assets/hero-illustration.png";
import featureMessaging from "@/assets/feature-messaging.png";
import featureDashboard from "@/assets/feature-dashboard.png";
import featureTracking from "@/assets/feature-tracking.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              ConnectHub
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10 animate-gradient"></div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Connect • Communicate • Grow
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Bridge the Gap Between
                <span className="gradient-primary bg-clip-text text-transparent"> Business & Customers</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Streamline communication, manage inquiries, and build lasting relationships with your customers—all in one powerful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?tab=signup">
                  <Button size="lg" variant="hero" className="w-full sm:w-auto">
                    Start Free Trial <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-hero opacity-20 blur-3xl"></div>
              <img
                src={heroIllustration}
                alt="Business communication platform"
                className="relative rounded-2xl shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Access Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Access Your
              <span className="gradient-primary bg-clip-text text-transparent"> Dashboard</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose your dashboard based on your role
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/dashboard">
              <Card className="p-8 space-y-6 shadow-elegant hover:shadow-primary transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Business Dashboard</h3>
                  <p className="text-muted-foreground">
                    Manage customer messages, track analytics, and oversee all communications
                  </p>
                </div>
                <div className="flex items-center text-primary font-semibold">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </Card>
            </Link>

            <Link to="/customer-dashboard">
              <Card className="p-8 space-y-6 shadow-elegant hover:shadow-secondary transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-secondary">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Customer Dashboard</h3>
                  <p className="text-muted-foreground">
                    View your conversations, track message status, and communicate with businesses
                  </p>
                </div>
                <div className="flex items-center text-secondary font-semibold">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need to
              <span className="gradient-primary bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your customer communication
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <img src={featureMessaging} alt="Instant Messaging" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">Instant Messaging</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time communication with customers. Respond instantly to inquiries and build trust.
              </p>
            </Card>

            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <img src={featureDashboard} alt="Secure Dashboard" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">Secure Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage all conversations in one place with powerful organization and search tools.
              </p>
            </Card>

            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <img src={featureTracking} alt="Analytics & Tracking" className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold">Analytics & Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track conversation history, response times, and customer satisfaction metrics.
              </p>
            </Card>

            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Enterprise Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level encryption and security measures to protect your business data.
              </p>
            </Card>

            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized performance ensures instant loading and seamless user experience.
              </p>
            </Card>

            <Card className="p-8 space-y-4 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Team Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work together with your team to provide the best customer experience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your
              <span className="gradient-primary bg-clip-text text-transparent"> Customer Communication?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of businesses already using ConnectHub to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?tab=signup" className="w-full sm:w-auto">
                <Button size="lg" variant="hero" className="w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ConnectHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bridging businesses and customers through seamless communication.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/" className="hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ConnectHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
