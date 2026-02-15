import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Archive, Star, Filter, Tag, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type TagType = "Important" | "Lead" | "Support" | "Follow-up";

const TAG_COLORS: Record<TagType, string> = {
  Important: "bg-destructive text-destructive-foreground",
  Lead: "bg-primary text-primary-foreground",
  Support: "bg-secondary text-secondary-foreground",
  "Follow-up": "bg-accent text-accent-foreground",
};

const ALL_TAGS: TagType[] = ["Important", "Lead", "Support", "Follow-up"];

interface Message {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  tags: TagType[];
}

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    const { data: msgs, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !msgs) return;

    // Fetch tags for all messages
    const { data: tags } = await supabase.from("message_tags").select("*");

    const enriched: Message[] = msgs.map((m) => ({
      ...m,
      tags: (tags || []).filter((t) => t.message_id === m.id).map((t) => t.tag as TagType),
    }));

    setMessages(enriched);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleTag = async (msgId: string, tag: TagType) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    if (msg.tags.includes(tag)) {
      await supabase.from("message_tags").delete().eq("message_id", msgId).eq("tag", tag);
    } else {
      await supabase.from("message_tags").insert({ message_id: msgId, tag });
    }
    fetchMessages();
  };

  const toggleStar = async (msgId: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;
    await supabase.from("messages").update({ is_starred: !msg.is_starred }).eq("id", msgId);
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_starred: !m.is_starred } : m)));
  };

  const archiveMessage = async (msgId: string) => {
    await supabase.from("messages").update({ is_archived: true }).eq("id", msgId);
    fetchMessages();
    toast({ title: "Message archived" });
  };

  const sendReply = async (msgId: string) => {
    if (!replyText.trim()) return;
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;

    const { error } = await supabase.from("message_replies").insert({
      message_id: msgId,
      reply_text: replyText,
    });

    if (error) {
      toast({ title: "Failed to send reply", description: error.message, variant: "destructive" });
      return;
    }

    // Mark as read
    await supabase.from("messages").update({ is_read: true }).eq("id", msgId);

    // Send notification to customer
    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "reply_sent",
          message_id: msgId,
          to_email: msg.customer_email,
          to_name: msg.customer_name,
          subject: `Re: ${msg.subject}`,
          body: replyText,
        },
      });
    } catch (err) {
      console.error("Notification error:", err);
    }

    toast({ title: "Reply sent!" });
    setReplyText("");
    setReplyingTo(null);
    fetchMessages();
  };

  const filtered = messages.filter((m) => {
    if (m.is_archived) return false;
    if (searchQuery && !m.subject.toLowerCase().includes(searchQuery.toLowerCase()) && !m.message.toLowerCase().includes(searchQuery.toLowerCase()) && !m.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus === "unread" && m.is_read) return false;
    if (filterStatus === "starred" && !m.is_starred) return false;
    if (filterTag !== "all" && !m.tags.includes(filterTag as TagType)) return false;
    if (dateFilter) {
      const msgDate = new Date(m.created_at);
      if (msgDate.toDateString() !== dateFilter.toDateString()) return false;
    }
    return true;
  });

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderMessage = (msg: Message) => (
    <Card key={msg.id} className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${!msg.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0 shadow-sm">
          {msg.customer_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold flex items-center gap-2 text-base">
                {msg.customer_name}
                {!msg.is_read && <Badge variant="default" className="text-xs animate-pulse">New</Badge>}
              </h4>
              <p className="text-sm text-muted-foreground">{msg.customer_email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStar(msg.id)}>
                <Star className={`h-4 w-4 ${msg.is_starred ? "fill-accent text-accent" : ""}`} />
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(msg.created_at)}</span>
            </div>
          </div>
          <p className="font-medium text-sm mb-2 text-foreground">{msg.subject}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {msg.tags.map((tag) => (
              <Badge key={tag} className={`text-xs ${TAG_COLORS[tag]}`}>
                <Tag className="h-3 w-3 mr-1" />{tag}
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">+ Tag</Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                {ALL_TAGS.map((tag) => (
                  <Button key={tag} variant={msg.tags.includes(tag) ? "default" : "ghost"} size="sm" className="w-full justify-start text-xs mb-1" onClick={() => toggleTag(msg.id, tag)}>
                    {tag}
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t">
        <Dialog open={replyingTo === msg.id} onOpenChange={(open) => { if (!open) setReplyingTo(null); }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" className="gap-2" onClick={() => setReplyingTo(msg.id)}>
              <Send className="h-3 w-3" /> Reply
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to {msg.customer_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">{msg.subject}</p>
                <p className="text-muted-foreground">{msg.message}</p>
              </div>
              <Textarea placeholder="Type your reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} />
              <Button onClick={() => sendReply(msg.id)} className="w-full gap-2">
                <Send className="h-4 w-4" /> Send Reply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button size="sm" variant="ghost" className="gap-2" onClick={() => archiveMessage(msg.id)}>
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
              <SelectTrigger className="w-32"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-36"><Tag className="h-4 w-4 mr-2" /><SelectValue placeholder="Tag" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {ALL_TAGS.map((tag) => (<SelectItem key={tag} value={tag}>{tag}</SelectItem>))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateFilter ? format(dateFilter, "MMM d") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} /></PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread ({messages.filter((m) => !m.is_read && !m.is_archived).length})</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-3">
            {filtered.length > 0 ? filtered.map(renderMessage) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No messages found</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="unread" className="space-y-3">
            {filtered.filter((m) => !m.is_read).map(renderMessage)}
          </TabsContent>
          <TabsContent value="archived" className="space-y-3">
            {messages.filter((m) => m.is_archived).length > 0
              ? messages.filter((m) => m.is_archived).map(renderMessage)
              : (
                <div className="text-center py-12">
                  <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No archived messages</p>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MessageList;
