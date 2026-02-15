import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Reply, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const EmailNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    newMessage: true,
    replyNotify: true,
    dailyDigest: false,
    urgentOnly: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setSettings({
          newMessage: data.new_message,
          replyNotify: data.reply_notify,
          dailyDigest: data.daily_digest,
          urgentOnly: data.urgent_only,
        });
      }
      setLoaded(true);
    };
    fetch();
  }, [user]);

  const toggle = async (key: keyof typeof settings) => {
    if (!user) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    const dbPayload = {
      user_id: user.id,
      new_message: updated.newMessage,
      reply_notify: updated.replyNotify,
      daily_digest: updated.dailyDigest,
      urgent_only: updated.urgentOnly,
    };

    const { error } = await supabase.from("notification_settings").upsert(dbPayload, { onConflict: "user_id" });

    if (error) {
      toast({ title: "Failed to save setting", description: error.message, variant: "destructive" });
      setSettings(settings); // revert
    }
  };

  if (!loaded) return null;

  return (
    <Card className="shadow-card mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">📧 Email Notifications</CardTitle>
        </div>
        <CardDescription>Configure how you and your customers receive notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Business Owner</h4>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <Label htmlFor="newMessage">New message arrives</Label>
              </div>
              <Switch id="newMessage" checked={settings.newMessage} onCheckedChange={() => toggle("newMessage")} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <Label htmlFor="dailyDigest">Daily digest summary</Label>
              </div>
              <Switch id="dailyDigest" checked={settings.dailyDigest} onCheckedChange={() => toggle("dailyDigest")} />
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Customer</h4>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Reply className="h-4 w-4 text-accent" />
                <Label htmlFor="replyNotify">Reply sent notification</Label>
              </div>
              <Switch id="replyNotify" checked={settings.replyNotify} onCheckedChange={() => toggle("replyNotify")} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-destructive" />
                <Label htmlFor="urgentOnly">Urgent messages only</Label>
              </div>
              <Switch id="urgentOnly" checked={settings.urgentOnly} onCheckedChange={() => toggle("urgentOnly")} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailNotifications;
