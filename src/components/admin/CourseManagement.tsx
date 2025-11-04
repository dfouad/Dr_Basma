import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: { id: number; name: string };
  duration: string;
  is_published: boolean;
}

interface Category {
  id: number;
  name: string;
}

export const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    category: "",
    duration: "",
    is_published: true,
  });

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

/*  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses/");
      setCourses(response.data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الدورات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };*/
  const fetchCourses = async () => {
  try {
    const response = await api.get("/courses/");
    
    // Handle both paginated and non-paginated responses
    const courseList = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
    
    setCourses(courseList);
  } catch (error) {
    toast({
      title: "خطأ",
      description: "فشل تحميل الدورات",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/");
      const categoryList = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
    
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: parseInt(formData.category),
      };

      if (editingCourse) {
        await api.put(`/admin/courses/${editingCourse.id}/update/`, payload);
        toast({ title: "تم التحديث", description: "تم تحديث الدورة بنجاح" });
      } else {
        await api.post("/admin/courses/create/", payload);
        toast({ title: "تم الإنشاء", description: "تم إنشاء الدورة بنجاح" });
      }

      setDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حفظ الدورة",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الدورة؟")) return;

    try {
      await api.delete(`/admin/courses/${id}/delete/`);
      toast({ title: "تم الحذف", description: "تم حذف الدورة بنجاح" });
      fetchCourses();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الدورة",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category.id.toString(),
      duration: course.duration,
      is_published: course.is_published,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      category: "",
      duration: "",
      is_published: true,
    });
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-right">إدارة الدورات</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة دورة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingCourse ? "تعديل دورة" : "إضافة دورة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان الدورة</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">رابط الصورة</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="اختر فئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">المدة</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="مثال: 4 ساعات"
                  required
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <Label htmlFor="is_published">نشر الدورة</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingCourse ? "تحديث" : "إنشاء"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">المدة</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-left align-middle">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-right">{course.title}</TableCell>
                  <TableCell className="text-right">{course.category?.name || "بدون فئة"}</TableCell>
                  <TableCell className="text-right">{course.duration}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.is_published ? 'منشور' : 'مسودة'}
                    </span>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2 justify-start">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
