import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Clock, TrendingUp, User, Search, Send, Archive, Star, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  // Mock data - will be replaced with real data from backend
  const stats = [
    { label: "Total Messages", value: "248", icon: MessageSquare, color: "text-primary" },
    { label: "Unread", value: "12", icon: Mail, color: "text-accent" },
    { label: "Avg Response Time", value: "2.3h", icon: Clock, color: "text-secondary" },
    { label: "This Month", value: "+23%", icon: TrendingUp, color: "text-primary" },
  ];

  const messages = [
    {
      id: 1,
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      subject: "Question about pricing",
      message: "Hi, I'd like to know more about your enterprise plan...",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      customer: "Mike Chen",
      email: "mike@example.com",
      subject: "Feature request",
      message: "Would it be possible to add export functionality...",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      customer: "Emma Davis",
      email: "emma@example.com",
      subject: "Great service!",
      message: "Just wanted to say thank you for the excellent support...",
      time: "1 day ago",
      unread: false,
    },
  ];

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
              ConnectHub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden md:flex">Business Owner</Badge>
            <Button variant="ghost" size="sm">Settings</Button>
            <Button variant="outline" size="sm">Log Out</Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-primary bg-clip-text text-transparent">Business Owner</span>
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your customer communications today.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
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
                <CardTitle className="text-2xl">Customer Messages</CardTitle>
                <CardDescription>Manage and respond to customer inquiries</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="unread">Unread ({messages.filter(m => m.unread).length})</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-3">
                {messages.map((msg) => (
                  <Card key={msg.id} className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${msg.unread ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                        {msg.customer.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 text-base">
                              {msg.customer}
                              {msg.unread && <Badge variant="default" className="text-xs animate-pulse">New</Badge>}
                            </h4>
                            <p className="text-sm text-muted-foreground">{msg.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Star className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                          </div>
                        </div>
                        <p className="font-medium text-sm mb-2 text-foreground">{msg.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button size="sm" variant="default" className="gap-2">
                        <Send className="h-3 w-3" />
                        Reply
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Archive className="h-3 w-3" />
                        Archive
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="unread" className="space-y-3">
                {messages.filter(msg => msg.unread).map((msg) => (
                  <Card key={msg.id} className="p-4 cursor-pointer transition-all hover:shadow-md border-l-4 border-l-primary bg-primary/5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
                        {msg.customer.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2 text-base">
                              {msg.customer}
                              <Badge variant="default" className="text-xs animate-pulse">New</Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">{msg.email}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                        </div>
                        <p className="font-medium text-sm mb-2">{msg.subject}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button size="sm" variant="default" className="gap-2">
                        <Send className="h-3 w-3" />
                        Reply
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-2">
                        <Archive className="h-3 w-3" />
                        Archive
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="archived">
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No archived messages</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button variant="outline">Load More Messages</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="shadow-elegant gradient-hero p-6 text-white border-0 hover:scale-105 transition-transform">
            <User className="h-10 w-10 mb-4 opacity-90" />
            <h3 className="font-bold text-xl mb-2">Profile Settings</h3>
            <p className="text-white/80 text-sm mb-4">Update your business information and preferences</p>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              Manage Profile
            </Button>
          </Card>

          <Card className="shadow-elegant p-6 border-secondary/20 hover:border-secondary hover:scale-105 transition-all">
            <MessageSquare className="h-10 w-10 text-secondary mb-4" />
            <h3 className="font-bold text-xl mb-2">Message Templates</h3>
            <p className="text-muted-foreground text-sm mb-4">Create and manage response templates</p>
            <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
              View Templates
            </Button>
          </Card>

          <Card className="shadow-elegant p-6 border-accent/20 hover:border-accent hover:scale-105 transition-all">
            <TrendingUp className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-bold text-xl mb-2">Analytics</h3>
            <p className="text-muted-foreground text-sm mb-4">View detailed reports and insights</p>
            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">
              View Reports
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
