import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { certificatesAPI, coursesAPI } from "@/lib/api";
import { Pencil, Trash2, Award } from "lucide-react";
import api from "@/lib/api";

interface Certificate {
  id: number;
  user: number;
  user_email: string;
  user_name: string;
  course: number;
  course_title: string;
  certificate_number: string;
  issued_at: string;
  template_text: string;
}

interface Course {
  id: number;
  title: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export function CertificateManagement() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [filterCourse, setFilterCourse] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    user: "",
    course: "",
    template_text: "",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchCertificates();
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

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users/");
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await certificatesAPI.getAllAdmin();
      const certsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setCertificates(certsData);
    } catch (error) {
      console.error("Failed to fetch certificates", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الشهادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user || !formData.course) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCertificate) {
        await certificatesAPI.update(editingCertificate.id, {
          template_text: formData.template_text,
        });
        toast({
          title: "نجح",
          description: "تم تحديث الشهادة بنجاح",
        });
      } else {
        await certificatesAPI.create({
          user: parseInt(formData.user),
          course: parseInt(formData.course),
          template_text: formData.template_text,
        });
        toast({
          title: "نجح",
          description: "تم إنشاء الشهادة بنجاح",
        });
      }
      fetchCertificates();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to save certificate", error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || "فشل حفظ الشهادة";
      toast({
        title: "خطأ",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الشهادة؟")) return;

    try {
      await certificatesAPI.delete(id);
      toast({
        title: "نجح",
        description: "تم حذف الشهادة بنجاح",
      });
      fetchCertificates();
    } catch (error) {
      console.error("Failed to delete certificate", error);
      toast({
        title: "خطأ",
        description: "فشل حذف الشهادة",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      user: certificate.user.toString(),
      course: certificate.course.toString(),
      template_text: certificate.template_text,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCertificate(null);
    setFormData({
      user: "",
      course: "",
      template_text: "",
    });
  };

  const filteredCertificates = filterCourse === "all" 
    ? certificates 
    : certificates.filter(cert => cert.course.toString() === filterCourse);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الشهادات</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Award className="ml-2 h-4 w-4" />
              إضافة شهادة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCertificate ? "تعديل الشهادة" : "إنشاء شهادة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="user">المستخدم *</Label>
                <Select
                  value={formData.user}
                  onValueChange={(value) => setFormData({ ...formData, user: value })}
                  required
                  disabled={!!editingCertificate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.email} {user.first_name && `(${user.first_name} ${user.last_name})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course">الدورة *</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => setFormData({ ...formData, course: value })}
                  required
                  disabled={!!editingCertificate}
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
                <Label htmlFor="template_text">نص القالب (اختياري)</Label>
                <Textarea
                  id="template_text"
                  value={formData.template_text}
                  onChange={(e) => setFormData({ ...formData, template_text: e.target.value })}
                  rows={4}
                  placeholder="نص مخصص للشهادة"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  إلغاء
                </Button>
                <Button type="submit">
                  {editingCertificate ? "تحديث" : "إنشاء"}
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
                <TableHead>رقم الشهادة</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>الدورة</TableHead>
                <TableHead>تاريخ الإصدار</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    لا توجد شهادات
                  </TableCell>
                </TableRow>
              ) : (
                filteredCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell className="font-medium">{certificate.certificate_number}</TableCell>
                    <TableCell>{certificate.user_name}</TableCell>
                    <TableCell>{certificate.course_title}</TableCell>
                    <TableCell>{new Date(certificate.issued_at).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(certificate)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(certificate.id)}
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
