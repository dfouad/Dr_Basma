import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Users, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !user.is_staff) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى لوحة التحكم",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);
  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle video upload logic
    console.log("Video upload submitted");
  };

  const handleUserEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle user enrollment logic
    console.log("User enrollment submitted");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
              <p className="text-muted-foreground">إدارة الدورات وتسجيل المستخدمين</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Video Section */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">رفع فيديو</h2>
                </div>

                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseSelect">اختر الدورة</Label>
                    <Select>
                      <SelectTrigger id="courseSelect">
                        <SelectValue placeholder="اختر دورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">إتقان القيادة</SelectItem>
                        <SelectItem value="2">التميز في التواصل</SelectItem>
                        <SelectItem value="3">العقلية والأداء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">عنوان الفيديو</Label>
                    <Input id="videoTitle" placeholder="أدخل عنوان الفيديو" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">الوصف</Label>
                    <Textarea
                      id="videoDescription"
                      placeholder="وصف مختصر للفيديو"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoFile">ملف الفيديو</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">اضغط للرفع أو اسحب وأفلت</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV حتى 500MB</p>
                      <input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    رفع الفيديو
                  </Button>
                </form>
              </div>

              {/* Enroll User Section */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold">تسجيل مستخدم</h2>
                </div>

                <form onSubmit={handleUserEnrollment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">البريد الإلكتروني للمستخدم</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollCourse">الدورة المراد التسجيل بها</Label>
                    <Select>
                      <SelectTrigger id="enrollCourse">
                        <SelectValue placeholder="اختر دورة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">إتقان القيادة</SelectItem>
                        <SelectItem value="2">التميز في التواصل</SelectItem>
                        <SelectItem value="3">العقلية والأداء</SelectItem>
                        <SelectItem value="4">إدارة الوقت الاحترافية</SelectItem>
                        <SelectItem value="5">الذكاء العاطفي</SelectItem>
                        <SelectItem value="6">وضع الأهداف وتحقيقها</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNote">ملاحظة (اختياري)</Label>
                    <Textarea
                      id="enrollmentNote"
                      placeholder="أضف ملاحظة للمستخدم"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" variant="secondary">
                    تسجيل المستخدم
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>ملاحظة:</strong> سيتلقى المستخدم إشعاراً بالبريد الإلكتروني عند التسجيل.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">إجمالي الدورات</p>
                <p className="text-3xl font-bold">6</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">إجمالي الفيديوهات</p>
                <p className="text-3xl font-bold">125</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">المستخدمون المسجلون</p>
                <p className="text-3xl font-bold">248</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
