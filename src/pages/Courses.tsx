import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { coursesAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  video_count: number;
  thumbnail: string;
  thumbnail_url?: string;
  price?: number | null;
  is_free?: boolean;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await coursesAPI.getAll();
         console.log('API Response:', response); // Add this line
        console.log('Response data:', response.data); // Add this line
        
          const data = response.data;
        const list = Array.isArray(data) ? data : data.results ?? [];
        setCourses(list);

      } catch (error) {
        console.error('Error fetching courses:', error); // Add this line
        toast({
          title: "خطأ في تحميل الدورات",
          description: "حاول مرة أخرى لاحقاً",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);



    const filteredCourses = (Array.isArray(courses) ? courses : []).filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* 🧭 Header Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">جميع الدورات</h1>
              <p className="text-lg text-muted-foreground">
                استكشف مكتبتنا الشاملة من الدورات المصممة لمساعدتك على النمو
                والنجاح.
              </p>

              {/* 🔍 Search input */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ابحث عن الدورات..."
                  className="pr-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🎓 Courses Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">لا توجد دورات متاحة حالياً</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    duration={course.duration}
                    videoCount={course.video_count}
                    thumbnail={course.thumbnail_url || course.thumbnail}
                    price={course.price}
                    is_free={course.is_free}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
