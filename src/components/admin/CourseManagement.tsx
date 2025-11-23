import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
<<<<<<< HEAD
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { coursesAPI } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
=======
import { Edit, Trash2, Plus, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { coursesAPI } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
>>>>>>> sara-.D

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: { id: number; name: string };
  duration: string;
<<<<<<< HEAD
  is_published: boolean;
  price?: number;
=======
  duration_in_days: number;
  is_published: boolean;
  price?: number;
  is_free: boolean;
>>>>>>> sara-.D
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
<<<<<<< HEAD
=======
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
>>>>>>> sara-.D
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    category: "",
    duration: "",
<<<<<<< HEAD
    price: "",
    is_published: true,
  });

=======
    duration_in_days: "1",
    price: "",
    is_published: true,
    is_free: false,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailMode, setThumbnailMode] = useState<"upload" | "link">("upload");
  const [imageLoadError, setImageLoadError] = useState(false);

>>>>>>> sara-.D
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
<<<<<<< HEAD
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
=======
    try {
      const response = await api.get("/admin/courses/");
      
      // Handle both paginated and non-paginated responses
      const courseList = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      
      // Map thumbnail_url_display to thumbnail for consistent interface
      const mappedCourses = courseList.map((course: any) => ({
        ...course,
        thumbnail: course.thumbnail_url_display || course.thumbnail_url || course.thumbnail || ''
      }));
      
      setCourses(mappedCourses);
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
>>>>>>> sara-.D


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

<<<<<<< HEAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category: parseInt(formData.category),
        price: formData.price ? parseFloat(formData.price) : null,
      };

      if (editingCourse) {
        await coursesAPI.update(editingCourse.id, payload);
        toast({ title: "تم التحديث", description: "تم تحديث الدورة بنجاح" });
      } else {
        await coursesAPI.create(payload);
        toast({ title: "تم الإنشاء", description: "تم إنشاء الدورة بنجاح" });
      }

=======
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post("/admin/categories/create/", {
        name: newCategoryName.trim(),
      });

      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء الفئة بنجاح",
      });

      // Refresh categories list
      await fetchCategories();
      
      // Select the newly created category
      setFormData({ ...formData, category: response.data.id.toString() });
      
      // Close dialog and reset
      setCategoryDialogOpen(false);
      setNewCategoryName("");
    } catch (error: any) {
      console.error("Error creating category:", error);
      
      // Check for duplicate name error
      if (error.response?.data?.name?.[0]?.includes("unique")) {
        toast({
          title: "خطأ",
          description: "اسم الفئة موجود بالفعل",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطأ",
          description: "فشل إنشاء الفئة",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an image is provided
    if (thumbnailMode === "upload" && !thumbnailFile) {
      toast({
        title: "صورة مطلوبة",
        description: "يرجى رفع صورة للدورة",
        variant: "destructive",
      });
      return;
    }
    
    if (thumbnailMode === "link" && !formData.thumbnail) {
      toast({
        title: "رابط الصورة مطلوب",
        description: "يرجى إدخال رابط الصورة",
        variant: "destructive",
      });
      return;
    }

    // Show warning if image URL has load error, but allow submission
    if (thumbnailMode === "link" && formData.thumbnail && imageLoadError) {
      toast({
        title: "تحذير",
        description: "فشل تحميل معاينة الصورة. سيتم حفظ الرابط على أي حال.",
        variant: "default",
      });
    }
    
    try {
      let response;
      const formDataToSend = new FormData();
      
      // Add common fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category_id", formData.category);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("duration_in_days", formData.duration_in_days);
      formDataToSend.append("is_published", formData.is_published ? "true" : "false");
      formDataToSend.append("is_free", formData.is_free ? "true" : "false");
      if (formData.price) {
        formDataToSend.append("price", formData.price);
      }

      // Add thumbnail based on mode - ONLY send the relevant field
      if (thumbnailMode === "upload" && thumbnailFile) {
        // Upload file mode - only send file, clear URL
        formDataToSend.append("thumbnail", thumbnailFile);
        formDataToSend.append("thumbnail_url", "");  // Explicitly clear URL
      } else if (thumbnailMode === "link" && formData.thumbnail) {
        // URL mode - only send URL, ensure no file
        formDataToSend.append("thumbnail_url", formData.thumbnail);
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

      toast({ 
        title: editingCourse ? "تم التحديث" : "تم الإنشاء", 
        description: editingCourse ? "تم تحديث الدورة بنجاح" : "تم إنشاء الدورة بنجاح" 
      });

>>>>>>> sara-.D
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

<<<<<<< HEAD
=======
  const handleTogglePublish = async (course: Course) => {
    try {
      const payload = {
        title: course.title,
        description: course.description,
        category_id: course.category.id,
        duration: course.duration,
        duration_in_days: course.duration_in_days,
        price: course.price || null,
        is_free: course.is_free,
        is_published: !course.is_published,
      };

      await api.patch(`/admin/courses/${course.id}/update/`, payload);
      
      toast({ 
        title: "تم التحديث", 
        description: `تم ${!course.is_published ? 'نشر' : 'إلغاء نشر'} الدورة بنجاح` 
      });
      
      fetchCourses();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة النشر",
        variant: "destructive",
      });
    }
  };

  const handleToggleFree = async (course: Course) => {
    try {
      const payload = {
        title: course.title,
        description: course.description,
        category_id: course.category.id,
        duration: course.duration,
        duration_in_days: course.duration_in_days,
        price: course.price || null,
        is_free: !course.is_free,
        is_published: course.is_published,
      };

      await api.patch(`/admin/courses/${course.id}/update/`, payload);
      
      toast({ 
        title: "تم التحديث", 
        description: `تم ${!course.is_free ? 'تحويل الدورة إلى مجانية' : 'تحويل الدورة إلى مدفوعة'}` 
      });
      
      fetchCourses();
    } catch (error) {
      console.error("Error toggling free status:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الدورة",
        variant: "destructive",
      });
    }
  };

>>>>>>> sara-.D
  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category.id.toString(),
      duration: course.duration,
<<<<<<< HEAD
      price: course.price?.toString() || "",
      is_published: course.is_published,
    });
=======
      duration_in_days: course.duration_in_days?.toString() || "1",
      price: course.price?.toString() || "",
      is_published: course.is_published,
      is_free: course.is_free || false,
    });
    // Set thumbnail preview for existing image
    if (course.thumbnail) {
      // Always show as link mode when editing with existing thumbnail
      setThumbnailMode("link");
      setThumbnailPreview("");
      setImageLoadError(false);
    }
>>>>>>> sara-.D
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
<<<<<<< HEAD
      price: "",
      is_published: true,
    });
=======
      duration_in_days: "1",
      price: "",
      is_published: true,
      is_free: false,
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setThumbnailMode("upload");
    setImageLoadError(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setFormData({ ...formData, thumbnail: "" }); // Clear URL when uploading file
      setImageLoadError(false); // Reset error state
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUrlChange = (url: string) => {
    setFormData({ ...formData, thumbnail: url });
    setThumbnailFile(null); // Clear file when using URL
    setThumbnailPreview("");
    setImageLoadError(false); // Reset error when URL changes
>>>>>>> sara-.D
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
<<<<<<< HEAD
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingCourse ? "تعديل دورة" : "إضافة دورة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
=======
          <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">{editingCourse ? "تعديل دورة" : "إضافة دورة جديدة"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] px-1">
>>>>>>> sara-.D
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
<<<<<<< HEAD
                <Label htmlFor="thumbnail">رابط الصورة</Label>
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
=======
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
                    {editingCourse && formData.thumbnail && !thumbnailFile && (
                      <div className="mb-3">
                        <Label className="text-sm text-muted-foreground">الصورة الحالية:</Label>
                        <img 
                          src={formData.thumbnail} 
                          alt="الصورة الحالية" 
                          className="mt-1 h-32 w-full object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {thumbnailPreview && (
                      <div className="mt-2">
                        <Label className="text-sm text-muted-foreground">معاينة الصورة الجديدة:</Label>
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
                      onChange={(e) => handleThumbnailUrlChange(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={imageLoadError ? "border-destructive" : ""}
                    />
                    {imageLoadError && formData.thumbnail && (
                      <p className="text-sm text-destructive">فشل تحميل الصورة من هذا الرابط</p>
                    )}
                    {formData.thumbnail && (
                      <div className="mt-2">
                        <Label className="text-sm text-muted-foreground">{editingCourse ? "الصورة الحالية:" : "معاينة الصورة:"}</Label>
                        <img 
                          src={formData.thumbnail} 
                          alt="معاينة" 
                          className="mt-1 h-32 w-full object-cover rounded-lg border"
                          onLoad={() => setImageLoadError(false)}
                          onError={() => setImageLoadError(true)}
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <Label htmlFor="category" className="block text-right mb-2">الفئة</Label>
                <div className="flex gap-2">
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category" className="flex-1">
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
                  <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" size="sm">
                        <Plus className="h-3 w-3 ml-1" />
                        إضافة فئة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent dir="rtl" className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-right">إضافة فئة جديدة</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateCategory} className="space-y-4">
                        <div>
                          <Label htmlFor="new-category">اسم الفئة</Label>
                          <Input
                            id="new-category"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="مثال: برمجة، تصميم، لغات"
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCategoryDialogOpen(false);
                              setNewCategoryName("");
                            }}
                          >
                            إلغاء
                          </Button>
                          <Button type="submit">حفظ</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
>>>>>>> sara-.D
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
<<<<<<< HEAD
=======
                <Label htmlFor="duration_in_days">مدة الدورة بالأيام</Label>
                <Input
                  id="duration_in_days"
                  type="number"
                  min="1"
                  value={formData.duration_in_days}
                  onChange={(e) => setFormData({ ...formData, duration_in_days: e.target.value })}
                  placeholder="مثال: 5"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  يستخدم لحساب التقدم: كل فيديو يشاهده الطالب يمثل يوم واحد
                </p>
              </div>
              <div>
>>>>>>> sara-.D
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
<<<<<<< HEAD
=======
                <TableHead className="text-center">مجاني</TableHead>
                <TableHead className="text-center">نشر</TableHead>
>>>>>>> sara-.D
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
<<<<<<< HEAD
                    <span className={`px-2 py-1 rounded text-xs ${course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.is_published ? 'منشور' : 'مسودة'}
=======
                    <div className="flex items-center gap-2 justify-center">
                      <Checkbox
                        checked={course.is_free}
                        onCheckedChange={() => handleToggleFree(course)}
                        aria-label="تبديل حالة المجانية"
                      />
                      
                    </div>
                  </TableCell>
                  <TableCell className="text-right " >
                    <div className="flex items-center gap-2 justify-center">
                      <Checkbox
                        checked={course.is_published}
                        onCheckedChange={() => handleTogglePublish(course)}
                        aria-label="تبديل حالة النشر"
                       />
                     </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.is_published ? 'منشور' : 'غير منشور'}
>>>>>>> sara-.D
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
