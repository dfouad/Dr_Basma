import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PlayCircle, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { enrollmentsAPI, coursesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import CourseCard from "@/components/CourseCard";
import CertificateDownloadDialog from "@/components/CertificateDownloadDialog";

interface EnrolledCourse {
  id: number;
  course: {
    id: number;
     title: string;
     description: string;
     duration: string;
     video_count: number;
     thumbnail: string;
     thumbnail_url?: string;  // Add this if API sends thumbnail_url
     category: {
      id: number;
      name: string;
  };
  progress: number;
  last_watched_video: {
  title: string;
  } | null;
}
}
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  video_count: number;
  thumbnail: string;
  thumbnail_url?: string;  // Add this if API sends thumbnail_url
  category: {
    id: number;
    name: string;
  };
}


const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const handleProfileUpdate = async () => {
    await refreshUser();
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Fetch enrollments
      const enrollmentResponse = await enrollmentsAPI.getAll();
      const rawData = enrollmentResponse.data;

      // Handle pagination or direct array
      const enrollmentsRaw = Array.isArray(rawData)
        ? rawData
        : rawData.results || [];

      // Normalize enrollment structure (handle cases without nested course)
     const enrollments: EnrolledCourse[] = enrollmentsRaw.map((item: any) => {
     const courseData = item.course || {};
     const categoryData = courseData.category || { id: 0, name: "غير مصنفة" };

  return {
    id: item.id,
    course: {
      id: courseData.id || item.course_id || 0,
      title: courseData.title || "دورة غير معروفة",
      description: courseData.description || "",
      duration: courseData.duration || "",
      video_count: courseData.video_count || 0,
      thumbnail: courseData.thumbnail || "",
      thumbnail_url: courseData.thumbnail_url || "",
      category: categoryData,
      progress: item.progress || 0,
      last_watched_video: item.last_watched_video || null,
    },
  };
});

      setEnrolledCourses(enrollments);

      // 2️⃣ Fetch all courses for recommendations
      const coursesResponse = await coursesAPI.getAll();
      const allCourses = Array.isArray(coursesResponse.data)
        ? coursesResponse.data
        : coursesResponse.data?.results || [];

      // 3️⃣ Prepare IDs and categories for recommendation
      const enrolledIds = enrollments.map((e) => e.course.id);
      const enrolledCategories = enrollments.map((e) => e.course.category.id);

      // 4️⃣ Recommend courses
      const recommended = allCourses
        .filter(
          (course: Course) =>
            !enrolledIds.includes(course.id) &&
            enrolledCategories.includes(course.category.id)
        )
        .slice(0, 3);

      setRecommendedCourses(recommended);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حاول مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [toast]);

  function getFullImageUrl(url: string): string {
    if (!url) return "/placeholder.svg";
    // If already absolute (starts with http or https), return as is
    if (/^https?:\/\//i.test(url)) return url;
    // Otherwise, treat as relative to the public folder or backend
    // You may want to adjust the base URL depending on your backend setup
    // Example: prepend your backend URL if needed
    // const BASE_URL = "https://your-backend.com";
    // return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    return url.startsWith("/") ? url : `/${url}`;
  }

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
                  {user && <ProfileEditDialog user={user} onUpdate={handleProfileUpdate} />}
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
                        {(enrollment.course.thumbnail_url || enrollment.course.thumbnail) ? (
                        <img 
                          src={getFullImageUrl(enrollment.course.thumbnail_url || enrollment.course.thumbnail)} 
                          alt={enrollment.course.title} 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                         }}
                          />
                         ) : (
                         <PlayCircle className="h-16 w-16 text-muted-foreground/30" />
                         )}
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">{enrollment.course.title}</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">التقدم</span>
                            <span className="font-medium">{enrollment.course.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.course.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border">
                          {enrollment.course.last_watched_video && (
                            <p className="text-sm text-muted-foreground mb-3">
                              آخر مشاهدة: {enrollment.course.last_watched_video.title}
                            </p>
                          )}
                          <Link to={`/courses/${enrollment.course.id}`}>
                            <Button className="w-full" variant="default">
                              متابعة التعلم
                            </Button>
                          </Link>
                          <CertificateDownloadDialog
                            courseTitle={enrollment.course.title}
                            courseId={enrollment.course.id}
                            progress={enrollment.course.progress}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Courses */}
            {recommendedCourses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">دورات موصى بها لك</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      videoCount={course.video_count}
                      thumbnail={course.thumbnail_url || course.thumbnail}
                    />
                  ))}
                </div>
              </div>
            )}

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
