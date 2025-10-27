import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, CheckCircle, ArrowRight } from "lucide-react";
import { coursesAPI, enrollmentsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: number;
  title: string;
  duration: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  video_count: number;
  thumbnail: string;
}

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await coursesAPI.getById(Number(id));
        setCourse(courseResponse.data);

        // Try to fetch videos - if successful, user is enrolled
        if (isAuthenticated) {
          try {
            const videosResponse = await coursesAPI.getVideos(Number(id));
            setVideos(videosResponse.data);
            setEnrolled(true);
          } catch (error: any) {
            if (error.response?.status === 403) {
              setEnrolled(false);
            }
          }
        }
      } catch (error) {
        toast({
          title: "خطأ في تحميل الدورة",
          description: "حاول مرة أخرى لاحقاً",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, isAuthenticated, toast]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentsAPI.create(Number(id));
      setEnrolled(true);
      
      // Fetch videos after enrollment
      const videosResponse = await coursesAPI.getVideos(Number(id));
      setVideos(videosResponse.data);
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "يمكنك الآن الوصول إلى محتوى الدورة",
      });
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "حاول مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-lg text-muted-foreground">الدورة غير موجودة</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Group videos by module (assuming order represents module grouping)
  const groupedVideos = videos.reduce((acc, video) => {
    const moduleIndex = Math.floor((video.order - 1) / 3);
    if (!acc[moduleIndex]) {
      acc[moduleIndex] = [];
    }
    acc[moduleIndex].push(video);
    return acc;
  }, {} as Record<number, Video[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Course Header */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowRight className="h-4 w-4" />
              العودة للدورات
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">{course.video_count} فيديو</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">شهادة متضمنة</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border sticky top-24">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    {course.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <PlayCircle className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <Button 
                    className="w-full mb-3" 
                    size="lg" 
                    variant="hero"
                    onClick={handleEnroll}
                    disabled={enrolled || enrolling}
                  >
                    {enrolling ? "جاري التسجيل..." : enrolled ? "مسجل بالفعل" : "التسجيل الآن"}
                  </Button>
                  {enrolled && (
                    <Link to="/profile">
                      <Button className="w-full" variant="outline">
                        متابعة التعلم
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        {enrolled && videos.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl font-bold mb-8">محتوى الدورة</h2>

              <div className="space-y-4">
                {Object.entries(groupedVideos).map(([moduleIndex, moduleVideos]) => (
                  <div key={moduleIndex} className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted/50 p-4 border-b border-border">
                      <h3 className="font-semibold text-lg">الوحدة {Number(moduleIndex) + 1}</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {moduleVideos.map((video) => (
                        <div key={video.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-5 w-5 text-primary" />
                              <span className="font-medium">{video.title}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{video.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
