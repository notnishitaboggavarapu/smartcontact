import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Send, Archive, Star, Filter, Tag, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type TagType = "Important" | "Lead" | "Support" | "Follow-up";

const TAG_COLORS: Record<TagType, string> = {
  Important: "bg-destructive text-destructive-foreground",
  Lead: "bg-primary text-primary-foreground",
  Support: "bg-secondary text-secondary-foreground",
  "Follow-up": "bg-accent text-accent-foreground",
};

const ALL_TAGS: TagType[] = ["Important", "Lead", "Support", "Follow-up"];

interface Message {
  id: number;
  customer: string;
  email: string;
  subject: string;
  message: string;
  time: string;
  unread: boolean;
  tags: TagType[];
  starred: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1, customer: "Sarah Johnson", email: "sarah@example.com",
    subject: "Question about pricing", message: "Hi, I'd like to know more about your enterprise plan...",
    time: "2 hours ago", unread: true, tags: ["Lead"], starred: false,
  },
  {
    id: 2, customer: "Mike Chen", email: "mike@example.com",
    subject: "Feature request", message: "Would it be possible to add export functionality...",
    time: "5 hours ago", unread: true, tags: ["Support"], starred: true,
  },
  {
    id: 3, customer: "Emma Davis", email: "emma@example.com",
    subject: "Great service!", message: "Just wanted to say thank you for the excellent support...",
    time: "1 day ago", unread: false, tags: ["Follow-up"], starred: false,
  },
];

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();

  const toggleTag = (msgId: number, tag: TagType) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, tags: m.tags.includes(tag) ? m.tags.filter((t) => t !== tag) : [...m.tags, tag] }
          : m
      )
    );
  };

  const toggleStar = (msgId: number) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, starred: !m.starred } : m)));
  };

  const filtered = messages.filter((m) => {
    if (searchQuery && !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !m.message.toLowerCase().includes(searchQuery.toLowerCase()) && !m.customer.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus === "unread" && !m.unread) return false;
    if (filterStatus === "starred" && !m.starred) return false;
    if (filterTag !== "all" && !m.tags.includes(filterTag as TagType)) return false;
    return true;
  });

  const renderMessage = (msg: Message) => (
    <Card key={msg.id} className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${msg.unread ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0 shadow-sm">
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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStar(msg.id)}>
                <Star className={`h-4 w-4 ${msg.starred ? "fill-accent text-accent" : ""}`} />
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
            </div>
          </div>
          <p className="font-medium text-sm mb-2 text-foreground">{msg.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {msg.tags.map((tag) => (
              <Badge key={tag} className={`text-xs ${TAG_COLORS[tag]}`}>
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
                  + Tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                {ALL_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    variant={msg.tags.includes(tag) ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs mb-1"
                    onClick={() => toggleTag(msg.id, tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t">
        <Button size="sm" variant="default" className="gap-2">
          <Send className="h-3 w-3" /> Reply
        </Button>
        <Button size="sm" variant="ghost" className="gap-2">
          <Archive className="h-3 w-3" /> Archive
        </Button>
      </div>
    </Card>
  );

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Customer Messages</CardTitle>
            <CardDescription>Manage and respond to customer inquiries</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-36">
                <Tag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {ALL_TAGS.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateFilter ? format(dateFilter, "MMM d") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread ({messages.filter((m) => m.unread).length})</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-3">
            {filtered.length > 0 ? filtered.map(renderMessage) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages match your filters</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="unread" className="space-y-3">
            {filtered.filter((m) => m.unread).map(renderMessage)}
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
  );
};

export default MessageList;
