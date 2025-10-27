import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface Video {
  id: number;
  title: string;
  video_url: string;
  duration: string;
  order: number;
  course: number;
}

interface Course {
  id: number;
  title: string;
}

export const VideoManagement = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    duration: "",
    order: 1,
    course: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/");
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الدورات",
        variant: "destructive",
      });
    }
  };

  const fetchVideos = async (courseId: string) => {
    if (!courseId) return;
    try {
      const response = await api.get(`/courses/${courseId}/videos/`);
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        course: parseInt(formData.course),
        order: parseInt(formData.order.toString()),
      };

      if (editingVideo) {
        await api.put(`/admin/videos/${editingVideo.id}/update/`, payload);
        toast({ title: "تم التحديث", description: "تم تحديث الفيديو بنجاح" });
      } else {
        await api.post("/admin/videos/create/", payload);
        toast({ title: "تم الإنشاء", description: "تم إنشاء الفيديو بنجاح" });
      }

      setDialogOpen(false);
      resetForm();
      if (formData.course) {
        fetchVideos(formData.course);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حفظ الفيديو",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفيديو؟")) return;

    try {
      await api.delete(`/admin/videos/${id}/delete/`);
      toast({ title: "تم الحذف", description: "تم حذف الفيديو بنجاح" });
      if (formData.course) {
        fetchVideos(formData.course);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الفيديو",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      video_url: video.video_url,
      duration: video.duration,
      order: video.order,
      course: video.course.toString(),
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      title: "",
      video_url: "",
      duration: "",
      order: 1,
      course: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفيديوهات</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة فيديو
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVideo ? "تعديل فيديو" : "إضافة فيديو جديد"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="course">الدورة</Label>
                <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="اختر دورة" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">عنوان الفيديو</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="video_url">رابط الفيديو</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="مثال: 15:30"
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
                  min={1}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingVideo ? "تحديث" : "إنشاء"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Label htmlFor="filterCourse">تصفية حسب الدورة</Label>
        <Select onValueChange={fetchVideos}>
          <SelectTrigger id="filterCourse">
            <SelectValue placeholder="اختر دورة لعرض الفيديوهات" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    اختر دورة لعرض الفيديوهات
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.title}</TableCell>
                    <TableCell>{video.duration}</TableCell>
                    <TableCell>{video.order}</TableCell>
                    <TableCell className="text-left">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(video)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
