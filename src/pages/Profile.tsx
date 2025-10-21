import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PlayCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    enrolledCourses: [
      {
        id: 1,
        title: "Leadership Mastery",
        progress: 45,
        lastWatched: "Module 2: Building Effective Teams",
      },
      {
        id: 2,
        title: "Communication Excellence",
        progress: 78,
        lastWatched: "Module 3: Advanced Communication",
      },
      {
        id: 3,
        title: "Mindset & Performance",
        progress: 23,
        lastWatched: "Module 1: Growth Mindset Fundamentals",
      },
    ],
  };

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
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-6">My Courses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          Last watched: {course.lastWatched}
                        </p>
                        <Link to={`/courses/${course.id}`}>
                          <Button className="w-full" variant="default">
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browse More */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Learn More?</h2>
              <p className="text-muted-foreground mb-6">
                Explore our full catalog of courses to continue your growth journey.
              </p>
              <Link to="/courses">
                <Button size="lg" variant="hero">
                  Browse All Courses
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
