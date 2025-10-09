import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Send, 
  Mail, 
  Shield, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";

const UserBenefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Communication",
      description: "Submit your queries instantly without waiting. No registration, no complex forms—just quick and easy messaging.",
    },
    {
      icon: Mail,
      title: "Automated Confirmations",
      description: "Receive instant email confirmations for every message you send, so you always know your communication was received.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your messages are securely delivered with end-to-end encryption. Your privacy and data security are our top priorities.",
    },
    {
      icon: CheckCircle2,
      title: "No Login Required",
      description: "Skip the hassle of creating accounts or remembering passwords. Just type your message and send—it's that simple.",
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Our streamlined interface ensures your message is sent in seconds. No lag, no delays—just fast, reliable communication.",
    },
    {
      icon: Sparkles,
      title: "Clean Interface",
      description: "Experience a beautifully designed, clutter-free interface that makes communication effortless and enjoyable.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Send className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart Contact</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero">Try It Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">User-Friendly Communication</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Communication Made
              <span className="gradient-primary bg-clip-text text-transparent"> Effortless</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a user's point of view, Smart Contact offers a simple and efficient way to reach out without the need for complex forms or logins. Just send your message and we'll take care of the rest.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/contact">
                <Button size="lg" variant="hero" className="gap-2">
                  Send a Message <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Users
              <span className="gradient-primary bg-clip-text text-transparent"> Love Us</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of simple, secure, and transparent communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="p-8 space-y-4 shadow-elegant hover:shadow-primary transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                How It
                <span className="gradient-primary bg-clip-text text-transparent"> Works</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Three simple steps to effortless communication
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Write Your Message",
                  description: "Simply type your name, email, and message in our clean, intuitive form. No account creation or complex fields required.",
                },
                {
                  step: "02",
                  title: "Instant Delivery",
                  description: "Hit send and your message is securely delivered to the business owner in real-time. You'll receive an automated confirmation email immediately.",
                },
                {
                  step: "03",
                  title: "Get a Response",
                  description: "The business owner will review your message and respond directly to your email. Fast, transparent, and reliable.",
                },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex flex-col md:flex-row gap-6 items-start p-8 rounded-2xl bg-card border-2 shadow-elegant hover:shadow-primary transition-all duration-300"
                >
                  <div className="text-6xl font-bold gradient-primary bg-clip-text text-transparent opacity-30">
                    {item.step}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-12 text-center space-y-6 bg-gradient-hero text-white shadow-2xl">
            <h2 className="text-4xl font-bold">
              Ready to Experience Effortless Communication?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of users who trust Smart Contact for their communication needs. No signup required—just send your first message now.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="gap-2">
                  Send Your First Message <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default UserBenefits;
