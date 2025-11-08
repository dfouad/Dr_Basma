import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { usersAPI } from "@/lib/api";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined: string;
  enrollments?: { id: number; course: { id: number; title: string } }[];
}

interface Course {
  id: number;
  title: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    is_staff: false,
  });

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/admin/courses/');
      setCourses(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      const usersData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      
      // Fetch enrollments for each user
      const usersWithEnrollments = await Promise.all(
        usersData.map(async (user: User) => {
          try {
            const enrollmentsResponse = await usersAPI.getEnrollments(user.id);
            return { ...user, enrollments: enrollmentsResponse.data || [] };
          } catch (error) {
            return { ...user, enrollments: [] };
          }
        })
      );
      
      setUsers(usersWithEnrollments);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await usersAPI.update(editingUser.id, formData);
      toast({ title: "تم التحديث", description: "تم تحديث المستخدم بنجاح" });
      setDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث المستخدم",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      await usersAPI.delete(id);
      toast({ title: "تم الحذف", description: "تم حذف المستخدم بنجاح" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف المستخدم",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      is_staff: user.is_staff,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      first_name: "",
      last_name: "",
      is_staff: false,
    });
  };

  const openAssignDialog = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedCourseId(null);
    setAssignDialogOpen(true);
  };

  const handleAssignCourse = async () => {
    if (!selectedUserId || !selectedCourseId) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار دورة",
        variant: "destructive",
      });
      return;
    }

    try {
      await usersAPI.assignCourse({
        user_id: selectedUserId,
        course_id: selectedCourseId,
      });
      toast({ title: "نجح", description: "تم تعيين الدورة بنجاح" });
      setAssignDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error assigning course:", error);
      const message = error.response?.data?.non_field_errors?.[0] || 
                      error.response?.data?.detail || 
                      "فشل تعيين الدورة";
      toast({
        title: "خطأ",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleUnassignCourse = async (userId: number, courseId: number) => {
    if (!confirm("هل أنت متأكد من إلغاء تسجيل المستخدم من هذه الدورة؟")) return;

    try {
      await usersAPI.unassignCourse({ user_id: userId, course_id: courseId });
      toast({ title: "نجح", description: "تم إلغاء التسجيل بنجاح" });
      fetchUsers();
    } catch (error) {
      console.error("Error unassigning course:", error);
      toast({
        title: "خطأ",
        description: "فشل إلغاء التسجيل",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-right">إدارة المستخدمين</h2>
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
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الدورات المسجلة</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-right">{user.email}</TableCell>
                  <TableCell className="text-right">{`${user.first_name} ${user.last_name}`.trim() || '-'}</TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${user.is_staff ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_staff ? 'مدير' : 'مستخدم'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.enrollments && user.enrollments.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {user.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="flex items-center gap-2 text-sm">
                            <span>{enrollment.course.title}</span>
                            {!user.is_staff && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnassignCourse(user.id, enrollment.course.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">لا توجد دورات</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{new Date(user.date_joined).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2 justify-start">
                      {!user.is_staff && (
                        <Button variant="outline" size="sm" onClick={() => openAssignDialog(user.id)}>
                          تعيين دورة
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل مستخدم</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="first_name">الاسم الأول</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">الاسم الأخير</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="checkbox"
                id="is_staff"
                checked={formData.is_staff}
                onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
              />
              <Label htmlFor="is_staff">مدير النظام</Label>
            </div>
            <Button type="submit" className="w-full">
              تحديث
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تعيين دورة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="course">اختر الدورة</Label>
              <select
                id="course"
                className="w-full p-2 border rounded-md"
                value={selectedCourseId || ""}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              >
                <option value="">اختر دورة...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAssignCourse} className="w-full">
              تعيين
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
