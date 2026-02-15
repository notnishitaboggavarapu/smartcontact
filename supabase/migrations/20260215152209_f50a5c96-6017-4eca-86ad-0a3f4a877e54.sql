
-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message tags table
CREATE TABLE public.message_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  tag TEXT NOT NULL CHECK (tag IN ('Important', 'Lead', 'Support', 'Follow-up')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, tag)
);

-- Create notification settings table
CREATE TABLE public.notification_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  new_message BOOLEAN NOT NULL DEFAULT true,
  reply_notify BOOLEAN NOT NULL DEFAULT true,
  daily_digest BOOLEAN NOT NULL DEFAULT false,
  urgent_only BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create replies table for tracking responses
CREATE TABLE public.message_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  replied_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_replies ENABLE ROW LEVEL SECURITY;

-- Messages: anyone can insert (contact form), owner can read/update/delete
CREATE POLICY "Anyone can submit a message" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their messages" ON public.messages FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Owners can update their messages" ON public.messages FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete their messages" ON public.messages FOR DELETE USING (owner_id = auth.uid());

-- Message tags: owner of parent message can manage
CREATE POLICY "Owners can view tags" ON public.message_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.messages WHERE messages.id = message_tags.message_id AND messages.owner_id = auth.uid()));
CREATE POLICY "Owners can add tags" ON public.message_tags FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.messages WHERE messages.id = message_tags.message_id AND messages.owner_id = auth.uid()));
CREATE POLICY "Owners can remove tags" ON public.message_tags FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.messages WHERE messages.id = message_tags.message_id AND messages.owner_id = auth.uid()));

-- Notification settings: users manage their own
CREATE POLICY "Users can view own settings" ON public.notification_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own settings" ON public.notification_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own settings" ON public.notification_settings FOR UPDATE USING (user_id = auth.uid());

-- Replies: owner of parent message can manage
CREATE POLICY "Owners can view replies" ON public.message_replies FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.messages WHERE messages.id = message_replies.message_id AND messages.owner_id = auth.uid()));
CREATE POLICY "Owners can add replies" ON public.message_replies FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.messages WHERE messages.id = message_replies.message_id AND messages.owner_id = auth.uid()));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
