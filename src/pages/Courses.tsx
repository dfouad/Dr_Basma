import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Leadership Mastery",
      description: "Develop essential leadership skills to inspire and guide your team to success through proven frameworks and real-world strategies.",
      duration: "6 weeks",
      videoCount: 24,
    },
    {
      id: 2,
      title: "Communication Excellence",
      description: "Master the art of effective communication in personal and professional settings. Learn to connect, persuade, and inspire.",
      duration: "4 weeks",
      videoCount: 18,
    },
    {
      id: 3,
      title: "Mindset & Performance",
      description: "Unlock your potential through proven mindset strategies and performance techniques used by top achievers.",
      duration: "8 weeks",
      videoCount: 32,
    },
    {
      id: 4,
      title: "Time Management Pro",
      description: "Learn advanced time management techniques to maximize productivity and achieve more in less time.",
      duration: "3 weeks",
      videoCount: 15,
    },
    {
      id: 5,
      title: "Emotional Intelligence",
      description: "Develop emotional intelligence skills to improve relationships, decision-making, and overall well-being.",
      duration: "5 weeks",
      videoCount: 20,
    },
    {
      id: 6,
      title: "Goal Setting & Achievement",
      description: "Master the science of goal setting and learn proven methods to turn your dreams into reality.",
      duration: "4 weeks",
      videoCount: 16,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">All Courses</h1>
              <p className="text-lg text-muted-foreground">
                Explore our comprehensive library of courses designed to help you grow and succeed.
              </p>

              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10 h-12"
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
