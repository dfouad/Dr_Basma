import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="سنوات" className="h-16 w-auto" />
              <span className="text-2xl font-bold">سنوات</span>
            </Link>
            <h1 className="text-3xl font-bold">{isLogin ? "مرحباً بعودتك" : "إنشاء حساب جديد"}</h1>
            <p className="text-muted-foreground">
              {isLogin ? "سجّل دخولك للوصول إلى دوراتك" : "ابدأ رحلة التعلم اليوم"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="اسمك الكامل"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
              <span className="text-primary font-semibold">{isLogin ? "سجّل الآن" : "تسجيل الدخول"}</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            → العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
