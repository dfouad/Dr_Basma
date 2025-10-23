import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import certifiedBadge from "@/assets/certified-badge.png";

const Index = () => {
  const featuredCourses = [
    {
      id: 1,
      title: "يوميات زوجه واعية",
      description: "طوّر مهارات القيادة الأساسية لإلهام فريقك وتوجيهه نحو النجاح.",
      duration: "6 أسابيع",
      videoCount: 24,
      thumbnail: "/courses/wayaa.jpg",
    },
    {
      id: 2,
      title: "عطاء أمن",
      description: "أتقن فن التواصل الفعّال في الحياة الشخصية والمهنية.",
      duration: "4 أسابيع",
      videoCount: 18,
      thumbnail: "/courses/Ataa.jpeg",
    },
    {
      id: 3,
      title: "ستوب ووتش",
      description: "اكتشف إمكاناتك من خلال استراتيجيات العقلية وتقنيات الأداء المثبتة.",
      duration: "8 أسابيع",
      videoCount: 32,
      thumbnail: "/courses/stop.jpg",
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
        <div className="container mx-auto px-4 py-20 md:py-15">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-20">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight text-foreground">
            تواصلي مع نفسك و أحبائك بطريقة أكثر وعيًا و راحة مع
              دكتورة السعادة
              </h1>
              
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
              {/* Certified Badge */}
              <div className="absolute -bottom-15 -right-6 w-16 h-16 md:w-20 md:h-20 animate-float">
                <img src={certifiedBadge} alt="Certified Happiness Life Coach" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
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

      {/* Quote Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="text-6xl text-primary mb-6">"</div>
            <blockquote className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
              لا امنحك السعادة فقط .. بل اقدم لك الإلهام لتصبحين افضل نسخة منك
            </blockquote>
            <div className="pt-6">
              <p className="text-lg font-semibold text-primary">د. بسمة كمال</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">آراء المتدربين</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تجارب حقيقية من متدربين نجحوا في تحقيق أهدافهم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-card-foreground mb-6 leading-relaxed">
                "دورة رائعة غيرت نظرتي للحياة. أسلوب د. بسمة في التدريب واضح وعملي ومؤثر جداً."
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold">م.س</span>
                </div>
                <div>
                  <p className="font-semibold">محمد السعيد</p>
                  <p className="text-sm text-muted-foreground">رائد أعمال</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-card-foreground mb-6 leading-relaxed">
                "استفدت كثيراً من الدورات. المحتوى منظم وسهل المتابعة. شكراً د. بسمة على هذا الجهد الرائع."
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold">ن.ع</span>
                </div>
                <div>
                  <p className="font-semibold">نور العتيبي</p>
                  <p className="text-sm text-muted-foreground">مديرة تسويق</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                ))}
              </div>
              <p className="text-card-foreground mb-6 leading-relaxed">
                "التدريب مع د. بسمة كان نقطة تحول في مسيرتي المهنية. أنصح به بشدة."
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold">ع.م</span>
                </div>
                <div>
                  <p className="font-semibold">علي المطيري</p>
                  <p className="text-sm text-muted-foreground">مهندس برمجيات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Coach Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">عن المدربة</h2>
              <h3 className="text-2xl font-semibold text-primary">د. بسمة كمال</h3>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              مع أكثر من 15 عاماً من الخبرة في التدريب والتطوير الشخصي، ساعدت آلاف الأفراد
              على تحويل حياتهم وتحقيق نتائج استثنائية. مهمتي هي تزويدك بالأدوات والاستراتيجيات
              والدعم الذي تحتاجه لإطلاق إمكاناتك الكاملة.
            </p>

            <div className="bg-card p-8 rounded-xl border border-border">
              <h4 className="text-xl font-bold mb-6 text-center">الشهادات والمؤهلات</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">دكتوراه في علم النفس التطبيقي</p>
                    <p className="text-sm text-muted-foreground">جامعة القاهرة</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">مدرب معتمد في البرمجة اللغوية العصبية</p>
                    <p className="text-sm text-muted-foreground">المعهد الدولي للتدريب</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">مستشار تطوير القيادة</p>
                    <p className="text-sm text-muted-foreground">معهد القيادة الاستراتيجية</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">خبير في التنمية البشرية</p>
                    <p className="text-sm text-muted-foreground">أكثر من 15 عاماً من الخبرة</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/auth">
                <Button size="lg" variant="default">
                  ابدأ رحلتك اليوم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
