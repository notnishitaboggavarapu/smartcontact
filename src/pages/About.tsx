import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Target, Users, Zap, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to simplifying business communication for everyone.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your success is our success. We build features you actually need.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly improving and staying ahead of industry trends.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Transparent, honest, and ethical in everything we do.",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Your data is protected with enterprise-grade security measures.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              ConnectHub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10 animate-gradient"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              About <span className="gradient-primary bg-clip-text text-transparent">ConnectHub</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We're on a mission to revolutionize how businesses communicate with their customers. 
              Founded in 2024, ConnectHub has grown to serve thousands of businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                ConnectHub was born from a simple observation: businesses were struggling to manage customer 
                communications across multiple channels. Email, phone, social media—it was chaotic and inefficient.
              </p>
              <p>
                We knew there had to be a better way. A platform that brings everything together, makes communication 
                seamless, and helps businesses build stronger relationships with their customers.
              </p>
              <p>
                Today, ConnectHub serves businesses of all sizes, from solo entrepreneurs to enterprise organizations. 
                Our platform processes millions of messages every month, helping businesses respond faster and serve 
                their customers better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Our <span className="gradient-primary bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="p-8 shadow-card hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">5K+</div>
              <p className="text-muted-foreground">Active Businesses</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">2M+</div>
              <p className="text-muted-foreground">Messages Processed</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">99.9%</div>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">24/7</div>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Join Our <span className="gradient-primary bg-clip-text text-transparent">Community?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Start streamlining your customer communication today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="hero">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
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

export default About;
