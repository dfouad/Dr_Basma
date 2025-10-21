import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "إتقان القيادة",
      description: "طوّر مهارات القيادة الأساسية لإلهام فريقك وتوجيهه نحو النجاح.",
      duration: "6 أسابيع",
      videoCount: 24,
    },
    {
      id: 2,
      title: "التميز في التواصل",
      description: "أتقن فن التواصل الفعّال في الحياة الشخصية والمهنية.",
      duration: "4 أسابيع",
      videoCount: 18,
    },
    {
      id: 3,
      title: "العقلية والأداء",
      description: "اكتشف إمكاناتك من خلال استراتيجيات العقلية وتقنيات الأداء المثبتة.",
      duration: "8 أسابيع",
      videoCount: 32,
    },
  ];

  const benefits = [
    "دروس فيديو من خبراء متخصصين",
    "وصول مدى الحياة لمحتوى الدورة",
    "موارد وأوراق عمل قابلة للتحميل",
    "شهادة إتمام الدورة",
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
                حوّل حياتك من خلال
                <span className="text-primary"> التدريب الاحترافي</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                احصل على دورات عالمية المستوى مصممة لإطلاق إمكاناتك وتسريع نموك الشخصي والمهني.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" variant="hero">
                    تصفح الدورات
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">
                    ابدأ مجاناً
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="التعليم الإلكتروني" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <Star className="h-6 w-6 text-secondary fill-secondary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl">4.9/5</p>
                    <p className="text-sm text-muted-foreground">تقييم الطلاب</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">الدورات المميزة</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              اكتشف دوراتنا الأكثر شعبية، المصممة بعناية لمساعدتك على تحقيق أهدافك.
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
                عرض جميع الدورات
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختار دوراتنا؟</h2>
              <p className="text-lg text-muted-foreground">
                كل ما تحتاجه للنجاح، في مكان واحد.
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
            <h2 className="text-3xl md:text-4xl font-bold">عن المدربة</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              مع أكثر من 15 عاماً من الخبرة في التدريب والتطوير الشخصي، ساعدت آلاف الأفراد
              على تحويل حياتهم وتحقيق نتائج استثنائية. مهمتي هي تزويدك بالأدوات والاستراتيجيات
              والدعم الذي تحتاجه لإطلاق إمكاناتك الكاملة.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="default">
                ابدأ رحلتك اليوم
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
