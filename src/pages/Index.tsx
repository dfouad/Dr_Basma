import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import ReviewsCarousel from "@/components/ReviewsCarousel"; 
import { ArrowLeft, CheckCircle, Star, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { videosAPI, reviewPhotosAPI, coursesAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";
import certifiedBadge from "@/assets/certified-badge.png";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";



const Index = () => {
  const [activeTab, setActiveTab] = useState<"courses" | "videos">("courses");
  const [freeVideos, setFreeVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [reviewPhotos, setReviewPhotos] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);


  useEffect(() => {
    if (activeTab === "videos") {
      fetchFreeVideos();
    } else if (activeTab === "courses") {
      fetchCourses();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviewPhotos();
    fetchCourses();
  }, []);

  const fetchReviewPhotos = async () => {
    try {
      const response = await reviewPhotosAPI.getAll();
      const photosData = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setReviewPhotos(photosData);
    } catch (error) {
      console.error("Failed to fetch review photos", error);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await coursesAPI.getAll();
      const coursesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      
      // Map courses to ensure thumbnail field is properly set
      const mappedCourses = coursesData.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        videoCount: course.video_count,
        thumbnail: course.thumbnail_url || course.thumbnail,
        price: course.price,
      }));
      
      // 👉 Only keep the first 5
    setCourses(mappedCourses.slice(0, 5));
  } catch (error) {
    console.error("Failed to fetch courses", error);
  } finally {
    setLoadingCourses(false);
  }
    
  };

  const fetchFreeVideos = async () => {
    setLoadingVideos(true);
    try {
      const response = await videosAPI.getFreeVideos();
      const videosData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || []);
      setFreeVideos(videosData);
    } catch (error) {
      console.error("Failed to fetch free videos", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const benefits = [
    "الصحة النفسية: نصائح وإرشادات تعزز الاستقرار النفسي",
    "الإرشاد الأسري: حلول عملية للتعامل مع التحديات الأسرية",
    "مهارات الحياة: أفكار مبتكرة لتطوير الذات وبناء علاقات صحية",
    "دعم الأمهات: نصائح للتعامل مع المراهقين وتربية جيل واثق ومبدع",
    "تنمية المراهقات" ,
    "التزكية النفسية"

  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-15">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-20">
              <h1 className="text-2xl md:text-2xl font-bold leading-tight text-foreground">
            تواصلي مع نفسك و أحبائك بطريقة أكثر وعيًا و راحة مع
              دكتورة السعادة
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/courses">
                  <Button size="lg" variant="hero">تصفحي الدورات
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">
                    ابدأي مجاناً
                  </Button>
                </Link>
                 <a
                  href="https://wa.me/message/IFEAWYSTJ2DUE1"
                  //href="https://wa.me/201555676851"
                  target="_blank"
                  rel="noopener noreferrer"
                 >
                  <Button size="lg" variant="outline">
                   احجزي جلستك الآن
                  </Button>
                </a>
                  
               
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={heroImage} alt="التعليم الإلكتروني" className="w-full h-auto" />
              </div>
                {/* Certified Badge */}
            {/* <div className="absolute -bottom-9 -right-4 w-16 h-16 md:w-20 md:h-20 animate-float">
                <img src={certifiedBadge} alt="Certified Happiness Life Coach" className="w-full h-full object-contain drop-shadow-2xl opacity-90" />
              </div>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses / Free Videos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={activeTab === "courses" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveTab("courses")}
              >
                الدورات
              </Button>
              <Button
                variant={activeTab === "videos" ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveTab("videos")}
              >
                الفيديوهات
              </Button>
            </div>
            {activeTab === "courses" && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">الدورات المميزة</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  اكتشفي دوراتنا الأكثر شعبية، المصممة بعناية لمساعدتك على تحقيق أهدافك.
                </p>
              </>
            )}
            {activeTab === "videos" && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">الفيديوهات المجانية</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  شاهد فيديوهاتنا المجانية للتعرف على محتوى الدورات
                </p>
              </>
            )}
          </div>

          {activeTab === "courses" && (
            <>
              {loadingCourses ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">جاري تحميل الدورات...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">لا توجد دورات متاحة حالياً</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
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
                </>
              )}
            </>
          )}

          {activeTab === "videos" && (
            <>
              {loadingVideos ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : freeVideos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">لا توجد فيديوهات مجانية متاحة حالياً</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {freeVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Play className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-primary">مجاني</span>
                        </div>
                        <CardTitle className="text-right">{video.title}</CardTitle>
                        {video.course_title && (
                          <CardDescription className="text-right">
                            من دورة: {video.course_title}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {video.description && (
                            <p className="text-sm text-muted-foreground text-right">{video.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">المدة: {video.duration}</span>
                          </div>
                          {video.video_url && (
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <Button className="w-full" variant="default">
                                شاهدى الآن
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">لماذا تختاري دوراتنا؟</h2>
              <p className="text-lg text-muted-foreground">
              نقدم لك محتوى مميز يهتم بدعم الأمهات والنساء في رحلتهن اليومية
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
<ReviewsCarousel reviewPhotos={reviewPhotos} />

      {/* About Coach Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">عن المدربة</h2>
              <h3 className="text-2xl font-semibold text-primary">د. بسمة كمال</h3>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
 هي
مدرِّبة أسرية وتربوية تهتم بتمكين المرأة والأم والفتاة من العيش بسلام داخلي وثقة في نفسها، من خلال تقديم برامج عملية تمزج بين العلم النفسي الحديث والإرشاد والهدي النبوي  والفطرة الإنسانية.
بدايه من ٢٠١٧ قدّمت بسمه عشرات الورش والبرامج الموجهة للأمهات والفتيات والمقبلات على الزواج، وتتميّز بأسلوب قريب، بسيط، وعملي يساعد الحاضرات على فهم أنفسهن وبناء علاقات صحية في بيوتهن.
وهي صاحبة مجموعة برامج قوية، منها: رُشد – احتواء – افضل نسخة منهم – حورية   – رابطة أمومة – خططي بنعومة – عطاء آمن 

تؤمن أن كل امرأة تستحق أن تعيش بخفة، وسلام، ورسالة، وأن تهذب روحها لتخدم بيتها ونفسها دون جلد أو قسوة.</p>

            <div className="bg-card p-8 rounded-xl border border-border">
              <h4 className="text-xl font-bold mb-6 text-center">الشهادات والمؤهلات</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">معالج نفسي إسلامي معتمد </p>
                    <p className="text-sm text-muted-foreground">البورد المصري</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">ماجستير مهني صحة نفسية </p>
                    <p className="text-sm text-muted-foreground">جامعة سوهاج</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">مدرب دولي معتمد </p>
                    <p className="text-sm text-muted-foreground">جامعة الأسكندرية</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">مستشار اسري وتربوي واخصائي تعديل سلوك</p>
                  </div>
                </div>

                  <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="font-semibold">مدرب مهارات الحياه للمراهقين والكبار</p>
                  </div>

                  <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="font-semibold"> معالج بالمدارس العلاجيه المختلفه ( علاج معرفي سلوكي - علاج جدلي سلوكي )</p>
                  </div>
                 
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="font-semibold">وكيل للمعهد العربي للصحة النفسيه </p>
                  </div>

                  <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="font-semibold">عضو في الجمعيه المصرية للمعالجين النفسيين</p>
                  </div>
            </div>
          </div>

            <div className="text-center">
              <Link to="/auth">
                <Button size="lg" variant="default">
                  ابدأى رحلتك اليوم
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
