import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/courses/")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw API data:", data);
        const courseList = Array.isArray(data) ? data : data.results || [];

        const normalized = courseList.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          duration: course.duration,
          videoCount: course.video_count,
          thumbnail: course.thumbnail
            ? `http://127.0.0.1:8000${course.thumbnail}`
            : undefined,
        }));

        console.log("✅ Normalized courses:", normalized);
        setCourses(normalized);
        setLoading(false); // ✅ stop loading after fetch
      })
      .catch((err) => {
        console.error("❌ Error loading courses:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        جارٍ تحميل الدورات...
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        لا توجد دورات حالياً
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">جميع الدورات</h1>
              <p className="text-lg text-muted-foreground">
                استكشف مكتبتنا الشاملة من الدورات المصممة لمساعدتك على النمو والنجاح.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ابحث عن الدورات..."
                  className="pr-10 h-12"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
