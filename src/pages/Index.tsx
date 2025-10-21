import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "Leadership Mastery",
      description: "Develop essential leadership skills to inspire and guide your team to success.",
      duration: "6 weeks",
      videoCount: 24,
    },
    {
      id: 2,
      title: "Communication Excellence",
      description: "Master the art of effective communication in personal and professional settings.",
      duration: "4 weeks",
      videoCount: 18,
    },
    {
      id: 3,
      title: "Mindset & Performance",
      description: "Unlock your potential through proven mindset strategies and performance techniques.",
      duration: "8 weeks",
      videoCount: 32,
    },
  ];

  const benefits = [
    "Expert-led video lessons",
    "Lifetime access to course materials",
    "Downloadable resources and worksheets",
    "Certificate of completion",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
                Transform Your Life Through
                <span className="text-primary"> Expert Coaching</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Access world-class courses designed to unlock your potential and accelerate your personal and professional growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" variant="hero">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="Online learning" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <Star className="h-6 w-6 text-secondary fill-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">4.9/5</p>
                    <p className="text-sm text-muted-foreground">Student Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular courses, carefully crafted to help you achieve your goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button variant="outline" size="lg">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Courses?</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to succeed, all in one place.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-card p-6 rounded-lg border border-border">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-card-foreground font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Coach Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">About Your Coach</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 15 years of experience in coaching and personal development, I've helped thousands of individuals
              transform their lives and achieve extraordinary results. My mission is to provide you with the tools, strategies,
              and support you need to unlock your full potential.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="default">
                Start Your Journey Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
