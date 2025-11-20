import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { reviewPhotosAPI } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

interface ReviewPhoto {
  id: number;
  title: string;
  image: string;
  image_url: string;
  show_on_homepage: boolean;
  uploaded_at: string;
  order: number;
}

export const ReviewManagement = () => {
  const [reviews, setReviews] = useState<ReviewPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
    show_on_homepage: false,
    order: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewPhotosAPI.getAllAdmin();
      const reviewsData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل التقييمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار صورة",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("image", formData.image);
      submitData.append("show_on_homepage", String(formData.show_on_homepage));
      submitData.append("order", String(formData.order));

      await reviewPhotosAPI.create(submitData);
      toast({ title: "تم الإضافة", description: "تمت إضافة التقييم بنجاح" });
      setDialogOpen(false);
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error("Error creating review:", error);
      toast({
        title: "خطأ",
        description: "فشل إضافة التقييم",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;

    try {
      await reviewPhotosAPI.delete(id);
      toast({ title: "تم الحذف", description: "تم حذف التقييم بنجاح" });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف التقييم",
        variant: "destructive",
      });
    }
  };

  const handleToggleHomepage = async (review: ReviewPhoto) => {
    try {
      const formData = new FormData();
      formData.append("show_on_homepage", String(!review.show_on_homepage));
      
      await reviewPhotosAPI.update(review.id, formData);
      toast({ 
        title: "تم التحديث", 
        description: review.show_on_homepage ? "تم إخفاء التقييم من الصفحة الرئيسية" : "تم عرض التقييم في الصفحة الرئيسية" 
      });
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث التقييم",
        variant: "destructive",
      });
    }
  };

  const handleChangeOrder = async (review: ReviewPhoto, direction: 'up' | 'down') => {
    try {
      const newOrder = direction === 'up' ? review.order - 1 : review.order + 1;
      const formData = new FormData();
      formData.append("order", String(newOrder));
      
      await reviewPhotosAPI.update(review.id, formData);
      toast({ title: "تم التحديث", description: "تم تحديث الترتيب بنجاح" });
      fetchReviews();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث الترتيب",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      image: null,
      show_on_homepage: false,
      order: 0,
    });
  };

  if (loading) return <div className="text-center py-8">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة التقييمات</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة تقييم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة تقييم جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">الصورة</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="order">الترتيب</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="show_on_homepage"
                  checked={formData.show_on_homepage}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, show_on_homepage: checked as boolean })
                  }
                />
                <Label htmlFor="show_on_homepage" className="cursor-pointer">
                  عرض في الصفحة الرئيسية
                </Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">إضافة</Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">العنوان</TableHead>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-right">الصفحة الرئيسية</TableHead>
              <TableHead className="text-right">الترتيب</TableHead>
              <TableHead className="text-right">تاريخ الرفع</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.title}</TableCell>
                <TableCell>
                  <img 
                    src={review.image_url} 
                    alt={review.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={review.show_on_homepage}
                    onCheckedChange={() => handleToggleHomepage(review)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{review.order}</span>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleChangeOrder(review, 'up')}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleChangeOrder(review, 'down')}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{new Date(review.uploaded_at).toLocaleDateString('ar-EG')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
