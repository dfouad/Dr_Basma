import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "يوميات زوجة واعية",
      description:
        "رحلة عملية للوعي الذاتي والعلاقات الزوجية تساعدك على تطوير وعيك وفهم احتياجاتك بعمق أكبر.",
      duration: "6 أسابيع",
      videoCount: 24,
      thumbnail: "/courses/wayaa.jpg",
    },
    {
      id: 2,
      title: "عطاء أمن",
      description:
        "أتقن فن التواصل الفعّال في الحياة الشخصية والمهنية. تعلّم كيفية التواصل والإقناع والإلهام.",
      duration: "4 أسابيع",
      videoCount: 18,
      thumbnail: "/courses/Ataa.jpeg",
    },
    {
      id: 3,
      title: "العقلية والأداء",
      description:
        "اكتشف إمكاناتك من خلال استراتيجيات العقلية وتقنيات الأداء المثبتة التي يستخدمها المتفوقون.",
      duration: "8 أسابيع",
      videoCount: 32,
      thumbnail: "/courses/stop.jpg",
    },
    {
      id: 4,
      title: "إدارة الوقت الاحترافية",
      description:
        "تعلّم تقنيات إدارة الوقت المتقدمة لتحقيق أقصى قدر من الإنتاجية وإنجاز المزيد في وقت أقل.",
      duration: "3 أسابيع",
      videoCount: 15,
      thumbnail: "/courses/time.jpg",
    },
    {
      id: 5,
      title: "الذكاء العاطفي",
      description:
        "طوّر مهارات الذكاء العاطفي لتحسين العلاقات واتخاذ القرارات والرفاهية العامة.",
      duration: "5 أسابيع",
      videoCount: 20,
      thumbnail: "/courses/emotional.jpg",
    },
    {
      id: 6,
      title: "وضع الأهداف وتحقيقها",
      description:
        "أتقن علم وضع الأهداف وتعلّم الطرق المثبتة لتحويل أحلامك إلى حقيقة.",
      duration: "4 أسابيع",
      videoCount: 16,
      thumbnail: "/courses/goals.jpg",
    },
  ];

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
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🎓 Courses Grid */}
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
