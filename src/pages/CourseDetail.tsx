import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, CheckCircle, ArrowLeft } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();

  // Mock course data - in real app, fetch based on id
  const course = {
    id: Number(id),
    title: "Leadership Mastery",
    description: "Develop essential leadership skills to inspire and guide your team to success through proven frameworks and real-world strategies. This comprehensive course covers everything from foundational leadership principles to advanced team management techniques.",
    duration: "6 weeks",
    videoCount: 24,
    enrolled: false,
  };

  const modules = [
    {
      id: 1,
      title: "Foundations of Leadership",
      videos: [
        { id: 1, title: "What Makes a Great Leader?", duration: "12:34" },
        { id: 2, title: "Leadership vs Management", duration: "10:21" },
        { id: 3, title: "Your Leadership Style", duration: "15:45" },
      ],
    },
    {
      id: 2,
      title: "Building Effective Teams",
      videos: [
        { id: 4, title: "Team Dynamics & Psychology", duration: "14:22" },
        { id: 5, title: "Hiring & Onboarding", duration: "18:30" },
        { id: 6, title: "Conflict Resolution", duration: "16:15" },
      ],
    },
    {
      id: 3,
      title: "Communication Mastery",
      videos: [
        { id: 7, title: "Active Listening Skills", duration: "11:40" },
        { id: 8, title: "Giving Effective Feedback", duration: "13:25" },
        { id: 9, title: "Difficult Conversations", duration: "17:10" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Course Header */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-12">
          <div className="container mx-auto px-4">
            <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
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
                    <span className="font-medium">{course.videoCount} videos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Certificate included</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-lg border border-border sticky top-24">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                  <Button className="w-full mb-3" size="lg" variant="hero">
                    {course.enrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                  <Button className="w-full" variant="outline">
                    Preview Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-8">Course Content</h2>

            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b border-border">
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {module.videos.map((video) => (
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
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
