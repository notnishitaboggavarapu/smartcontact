import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CustomerDashboard = () => {
  // Mock data - will be replaced with real data from backend
  const stats = [
    { label: "Total Sent", value: "8", icon: Send, color: "text-primary" },
    { label: "Pending", value: "3", icon: Clock, color: "text-accent" },
    { label: "Replied", value: "5", icon: CheckCircle, color: "text-secondary" },
  ];

  const conversations = [
    {
      id: 1,
      subject: "Question about pricing",
      message: "Hi, I'd like to know more about your enterprise plan...",
      sentAt: "2 hours ago",
      status: "replied",
      reply: "Thank you for your interest! Our enterprise plan includes...",
      repliedAt: "1 hour ago",
    },
    {
      id: 2,
      subject: "Feature request",
      message: "Would it be possible to add export functionality...",
      sentAt: "5 hours ago",
      status: "pending",
    },
    {
      id: 3,
      subject: "Great service!",
      message: "Just wanted to say thank you for the excellent support...",
      sentAt: "1 day ago",
      status: "replied",
      reply: "We're so glad you're enjoying our service! Your feedback means a lot.",
      repliedAt: "1 day ago",
    },
    {
      id: 4,
      subject: "Account setup help",
      message: "I'm having trouble setting up my account...",
      sentAt: "2 days ago",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    if (status === "replied") {
      return <Badge variant="secondary" className="bg-secondary/10 text-secondary">Replied</Badge>;
    }
    return <Badge variant="default" className="bg-accent/10 text-accent">Pending</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Navigation */}
      <nav className="border-b backdrop-blur-sm bg-background/95 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Smart Contact
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden md:flex">Customer</Badge>
            <Button variant="ghost" size="sm">My Account</Button>
            <Button variant="outline" size="sm">Log Out</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span className="gradient-primary bg-clip-text text-transparent">Messages</span>
            </h1>
            <p className="text-muted-foreground">Track your conversations and get support</p>
          </div>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="gap-2 shadow-elegant">
              <Plus className="h-5 w-5" />
              New Message
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0">
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

        {/* Messages Section */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Your Conversations</CardTitle>
                <CardDescription>View all your messages and replies</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="pending">Pending ({conversations.filter(c => c.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="replied">Replied</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {conversations.map((conv) => (
                  <Card key={conv.id} className="p-5 cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                    <div className="space-y-4">
                      {/* Original Message */}
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                              Y
                            </div>
                            <div>
                              <h4 className="font-semibold text-base">You</h4>
                              <p className="text-xs text-muted-foreground">{conv.sentAt}</p>
                            </div>
                          </div>
                          {getStatusBadge(conv.status)}
                        </div>
                        <p className="font-medium text-sm mb-2 text-foreground pl-13">{conv.subject}</p>
                        <p className="text-sm text-muted-foreground pl-13">{conv.message}</p>
                      </div>

                      {/* Reply if exists */}
                      {conv.reply && (
                        <div className="pl-13 pt-3 border-t border-l-4 border-l-secondary ml-5">
                          <div className="flex items-start gap-3 mb-2">
                            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm text-secondary">Support Team</h4>
                              <p className="text-xs text-muted-foreground">{conv.repliedAt}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground ml-8">{conv.reply}</p>
                        </div>
                      )}

                      {/* Pending indicator */}
                      {conv.status === 'pending' && (
                        <div className="pl-13 pt-3 border-t border-l-4 border-l-accent ml-5">
                          <div className="flex items-center gap-3 text-accent">
                            <Clock className="h-5 w-5" />
                            <p className="text-sm font-medium">Waiting for response...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="pending" className="space-y-4">
                {conversations.filter(conv => conv.status === 'pending').map((conv) => (
                  <Card key={conv.id} className="p-5 border-l-4 border-l-accent bg-accent/5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold flex-shrink-0">
                          Y
                        </div>
                        <div>
                          <h4 className="font-semibold">You</h4>
                          <p className="text-xs text-muted-foreground">{conv.sentAt}</p>
                        </div>
                      </div>
                      {getStatusBadge(conv.status)}
                    </div>
                    <p className="font-medium text-sm mb-2 pl-13">{conv.subject}</p>
                    <p className="text-sm text-muted-foreground pl-13">{conv.message}</p>
                    <div className="pl-13 pt-3 mt-3 border-t">
                      <div className="flex items-center gap-3 text-accent">
                        <Clock className="h-5 w-5" />
                        <p className="text-sm font-medium">Waiting for response...</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="replied" className="space-y-4">
                {conversations.filter(conv => conv.status === 'replied').map((conv) => (
                  <Card key={conv.id} className="p-5 border-l-4 border-l-secondary bg-secondary/5">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold flex-shrink-0">
                              Y
                            </div>
                            <div>
                              <h4 className="font-semibold">You</h4>
                              <p className="text-xs text-muted-foreground">{conv.sentAt}</p>
                            </div>
                          </div>
                          {getStatusBadge(conv.status)}
                        </div>
                        <p className="font-medium text-sm mb-2 pl-13">{conv.subject}</p>
                        <p className="text-sm text-muted-foreground pl-13">{conv.message}</p>
                      </div>
                      {conv.reply && (
                        <div className="pl-13 pt-3 border-t border-l-4 border-l-secondary ml-5">
                          <div className="flex items-start gap-3 mb-2">
                            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm text-secondary">Support Team</h4>
                              <p className="text-xs text-muted-foreground">{conv.repliedAt}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground ml-8">{conv.reply}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Card */}
        <div className="mt-8">
          <Card className="shadow-elegant gradient-hero p-8 text-white border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-2xl mb-2">Need immediate assistance?</h3>
                <p className="text-white/80">Our support team typically responds within 24 hours</p>
              </div>
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg">
                  Send New Message
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
