import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PlayCircle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { enrollmentsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface EnrolledCourse {
  id: number;
  course: {
    id: number;
    title: string;
    thumbnail: string;
  };
  progress: number;
  last_watched_video: {
    title: string;
  } | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentsAPI.getAll();
        const data = response.data;
        // Ensure data is an array before setting state
        setEnrolledCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        toast({
          title: "خطأ في تحميل الدورات",
          description: "حاول مرة أخرى لاحقاً",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user?.first_name || "المستخدم"}
                  </h1>
                  <p className="text-muted-foreground mb-4">{user?.email}</p>
                  <Button variant="outline">تعديل الملف الشخصي</Button>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-6">دوراتي</h2>
              {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : enrolledCourses.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <p className="text-lg text-muted-foreground mb-4">لم تسجل في أي دورة بعد</p>
                  <Link to="/courses">
                    <Button>تصفح الدورات</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment) => (
                    <div key={enrollment.id} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        {enrollment.course.thumbnail ? (
                          <img 
                            src={enrollment.course.thumbnail} 
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PlayCircle className="h-12 w-12 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">التقدم</span>
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          {enrollment.last_watched_video && (
                            <p className="text-sm text-muted-foreground mb-3">
                              آخر مشاهدة: {enrollment.last_watched_video.title}
                            </p>
                          )}
                          <Link to={`/courses/${enrollment.course.id}`}>
                            <Button className="w-full" variant="default">
                              متابعة التعلم
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Browse More */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">مستعد لتعلم المزيد؟</h2>
              <p className="text-muted-foreground mb-6">
                استكشف كتالوجنا الكامل من الدورات لمواصلة رحلة نموك.
              </p>
              <Link to="/courses">
                <Button size="lg" variant="hero">
                  تصفح جميع الدورات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
