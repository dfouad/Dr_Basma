import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { coursesAPI } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: { id: number; name: string };
  duration: string;
  is_published: boolean;
  price?: number;
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
    price: "",
    is_published: true,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailMode, setThumbnailMode] = useState<"upload" | "link">("upload");

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
      let response;

      if (thumbnailFile) {
        // Upload with file
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("thumbnail", thumbnailFile);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("duration", formData.duration);
        formDataToSend.append("is_published", String(formData.is_published));
        if (formData.price) {
          formDataToSend.append("price", formData.price);
        }

        if (editingCourse) {
          response = await api.put(`/admin/courses/${editingCourse.id}/update/`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await api.post("/admin/courses/create/", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        // Use URL link
        const payload = {
          ...formData,
          category: parseInt(formData.category),
          price: formData.price ? parseFloat(formData.price) : null,
        };

        if (editingCourse) {
          response = await coursesAPI.update(editingCourse.id, payload);
        } else {
          response = await coursesAPI.create(payload);
        }
      }

      toast({ 
        title: editingCourse ? "تم التحديث" : "تم الإنشاء", 
        description: editingCourse ? "تم تحديث الدورة بنجاح" : "تم إنشاء الدورة بنجاح" 
      });

      setDialogOpen(false);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
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
      await coursesAPI.delete(id);
      toast({ title: "تم الحذف", description: "تم حذف الدورة بنجاح" });
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
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
      price: course.price?.toString() || "",
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
      price: "",
      is_published: true,
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setThumbnailMode("upload");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingCourse ? "تعديل دورة" : "إضافة دورة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] px-1">
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
                <Label>صورة الدورة</Label>
                <Tabs value={thumbnailMode} onValueChange={(value) => setThumbnailMode(value as "upload" | "link")} className="mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="h-4 w-4" />
                      رفع من الجهاز
                    </TabsTrigger>
                    <TabsTrigger value="link" className="gap-2">
                      <LinkIcon className="h-4 w-4" />
                      رابط خارجي
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {thumbnailPreview && (
                      <div className="mt-2">
                        <Label className="text-sm text-muted-foreground">معاينة الصورة:</Label>
                        <img 
                          src={thumbnailPreview} 
                          alt="معاينة" 
                          className="mt-1 h-32 w-full object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="link" className="space-y-3">
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.thumbnail && (
                      <div className="mt-2">
                        <Label className="text-sm text-muted-foreground">معاينة الصورة:</Label>
                        <img 
                          src={formData.thumbnail} 
                          alt="معاينة" 
                          className="mt-1 h-32 w-full object-cover rounded-lg border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
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
              <div>
                <Label htmlFor="price">السعر (اختياري)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="مثال: 99.99"
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked as boolean })}
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
                <TableHead className="text-right">الإجراءات</TableHead>
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
