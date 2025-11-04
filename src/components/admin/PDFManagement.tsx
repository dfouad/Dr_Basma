import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { pdfsAPI, coursesAPI } from "@/lib/api";
import { Pencil, Trash2, FileUp, Download } from "lucide-react";

interface PDF {
  id: number;
  title: string;
  description: string;
  pdf_file: string;
  pdf_url: string;
  course: number;
  course_title: string;
  order: number;
  created_at: string;
}

interface Course {
  id: number;
  title: string;
}

export function PDFManagement() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPdf, setEditingPdf] = useState<PDF | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [filterCourse, setFilterCourse] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    order: "0",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchPdfs();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      const coursesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الدورات",
        variant: "destructive",
      });
    }
  };

  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const response = await pdfsAPI.getAll();
      const pdfsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setPdfs(pdfsData);
    } catch (error) {
      console.error("Failed to fetch PDFs", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل ملفات PDF",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.course) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (!editingPdf && !pdfFile) {
      toast({
        title: "خطأ",
        description: "يرجى تحميل ملف PDF",
        variant: "destructive",
      });
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("course", formData.course);
    data.append("order", formData.order);
    
    if (pdfFile) {
      data.append("pdf_file", pdfFile);
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      if (editingPdf) {
        await pdfsAPI.update(editingPdf.id, data);
        toast({
          title: "نجح",
          description: "تم تحديث ملف PDF بنجاح",
        });
      } else {
        await pdfsAPI.create(data);
        toast({
          title: "نجح",
          description: "تم إضافة ملف PDF بنجاح",
        });
      }
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      fetchPdfs();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save PDF", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ ملف PDF",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;

    try {
      await pdfsAPI.delete(id);
      toast({
        title: "نجح",
        description: "تم حذف ملف PDF بنجاح",
      });
      fetchPdfs();
    } catch (error) {
      console.error("Failed to delete PDF", error);
      toast({
        title: "خطأ",
        description: "فشل حذف ملف PDF",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (pdf: PDF) => {
    setEditingPdf(pdf);
    setFormData({
      title: pdf.title,
      description: pdf.description,
      course: pdf.course.toString(),
      order: pdf.order.toString(),
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPdf(null);
    setFormData({
      title: "",
      description: "",
      course: "",
      order: "0",
    });
    setPdfFile(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const filteredPdfs = filterCourse === "all" 
    ? pdfs 
    : pdfs.filter(pdf => pdf.course.toString() === filterCourse);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-right">إدارة ملفات PDF</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <FileUp className="mr-2 h-4 w-4" />
              إضافة ملف PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">
                {editingPdf ? "تعديل ملف PDF" : "إضافة ملف PDF جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان *</Label>
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
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="course">الدورة *</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                  required
                >
                  <SelectTrigger>
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
                <Label htmlFor="order">الترتيب</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="pdf_file">ملف PDF {!editingPdf && "*"}</Label>
                <Input
                  id="pdf_file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  required={!editingPdf}
                  disabled={isUploading}
                />
                {pdfFile && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ تم اختيار الملف: {pdfFile.name}
                  </p>
                )}
                {editingPdf && !pdfFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    اترك فارغاً للاحتفاظ بالملف الحالي
                  </p>
                )}
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>جاري التحميل...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isUploading}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "جاري الحفظ..." : editingPdf ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Label htmlFor="filter-course">تصفية حسب الدورة</Label>
        <Select value={filterCourse} onValueChange={setFilterCourse}>
          <SelectTrigger className="w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الدورات</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-8">جاري التحميل...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الدورة</TableHead>
                <TableHead className="text-right">الترتيب</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPdfs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد ملفات PDF
                  </TableCell>
                </TableRow>
              ) : (
                filteredPdfs.map((pdf) => (
                  <TableRow key={pdf.id}>
                    <TableCell className="font-medium text-right">{pdf.title}</TableCell>
                    <TableCell className="text-right">{pdf.course_title}</TableCell>
                    <TableCell className="text-right">{pdf.order}</TableCell>
                    <TableCell className="text-right">{new Date(pdf.created_at).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2 justify-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(pdf.pdf_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(pdf)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(pdf.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
}
