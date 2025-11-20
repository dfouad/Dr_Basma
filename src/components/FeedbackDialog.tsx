import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { feedbackAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface FeedbackDialogProps {
  courseId: number;
  courseTitle: string;
}

const FeedbackDialog = ({ courseId, courseTitle }: FeedbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
  const checkFeedback = async () => {
    if (!user) return; // must be logged in

    try {
      const res = await feedbackAPI.getAll(courseId);
      const results = res.data.results ?? res.data ?? [];

      const found = results.some((f: any) => {
        const sameCourse =
          f.course === courseId || f.course?.id === courseId;
        const sameUser =
          f.user === user.id || f.user?.id === user.id;
        return sameCourse && sameUser;
      });

      setIssued(found);
    } catch (err) {
      console.error("Failed to check feedback:", err);
      // optionally: setIssued(false);
    }
  };

  checkFeedback();
}, [courseId, user]);


  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار تقييم",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: "خطأ",
        description: "يرجى كتابة تعليق لا يقل عن 10 أحرف",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackAPI.create({
        course: courseId,
        rating,
        comment: comment.trim(),
      });

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "تم إرسال التقييم",
          description: "شكراً لك على مشاركة رأيك",
        });

        // ✅ Save locally so it persists until removed from DB
        const issuedCourses = JSON.parse(localStorage.getItem("issuedFeedback") || "[]");
        if (!issuedCourses.includes(courseId)) {
          issuedCourses.push(courseId);
          localStorage.setItem("issuedFeedback", JSON.stringify(issuedCourses));
        }

        setIssued(true);
        setOpen(false);
      } else {
        throw new Error("لم يتم تأكيد الإرسال من الخادم");
      }
    } catch (error: any) {
      toast({
        title: "خطأ",
        description:
          error.response?.data?.detail ||
          error.response?.data?.non_field_errors?.[0] ||
          "حدث خطأ أثناء إرسال التقييم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Disable if already submitted
  if (issued) {
    return (
      <Button
        variant="default"
        className="w-full mt-2 flex items-center justify-center gap-2"
        disabled
      >
        <CheckCircle className="h-4 w-4 text-green-600" />
        تم إرسال التقييم
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          اكتب تقييماً
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تقييم الدورة: {courseTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              التعليق
            </label>
            <Textarea
              id="comment"
              placeholder="شاركنا رأيك في الدورة (لمرة واحدة فقط)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{comment.length}/500 حرف</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "جاري الإرسال..." : "إرسال التقييم"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
