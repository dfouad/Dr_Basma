import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const ContactDialog = () => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) {
      toast({
        title: "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }

    if (trimmedSubject.length > 200) {
      toast({ title: "الموضوع طويل جداً", variant: "destructive" });
      return;
    }

    if (trimmedMessage.length > 2000) {
      toast({ title: "الرسالة طويلة جداً", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await api.post("/contact/", {
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      toast({ title: "تم إرسال رسالتك بنجاح ✉️" });
      setSubject("");
      setMessage("");
      setOpen(false);
    } catch {
      toast({
        title: "فشل إرسال الرسالة",
        description: "حاولي مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          إرسال رسالة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">إرسال رسالة للإدارة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-right block">
              الموضوع
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="اكتبي موضوع الرسالة"
              maxLength={200}
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-right block">
              الرسالة
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتبي رسالتك هنا..."
              rows={5}
              maxLength={2000}
              dir="rtl"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
