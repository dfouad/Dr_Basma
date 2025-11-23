import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
=======
import { Link, useNavigate ,useSearchParams} from "react-router-dom";
>>>>>>> sara-.D
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
<<<<<<< HEAD
import logo from "@/assets/logo.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
=======
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.jpg";


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
>>>>>>> sara-.D
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
=======
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && isLogin) {
      navigate('/profile');
    }
  }, [isAuthenticated, isLogin, navigate]);

 /* const handleSubmit = async (e: React.FormEvent) => {
>>>>>>> sara-.D
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/profile');
      } else {
        if (formData.password !== formData.confirmPassword) {
<<<<<<< HEAD
          throw new Error("كلمات المرور غير متطابقة");
        }
        await register(formData.email, formData.password, formData.firstName, formData.lastName);
        navigate('/profile');
=======
          toast({
            title: "خطأ في التسجيل",
            description: "كلمات المرور غير متطابقة",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        await register(formData.email, formData.password, formData.firstName, formData.lastName);
        // Show success message instead of navigating
        setRegistrationSuccess(true);
        setRegisteredEmail(formData.email);
>>>>>>> sara-.D
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
=======
*/
    console.log("render: isLogin =", isLogin);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     console.log("SUBMIT: login handler");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SUBMIT: register handler");
    setLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "خطأ في التسجيل",
          description: "كلمات المرور غير متطابقة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      setRegistrationSuccess(true);
      setRegisteredEmail(formData.email);
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };
>>>>>>> sara-.D

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="دكتور سعادة" className="h-16 w-auto" />
              <span className="text-2xl font-bold">دكتور سعادة</span>
            </Link>
<<<<<<< HEAD
            <h1 className="text-3xl font-bold">{isLogin ? "مرحباً بعودتك" : "إنشاء حساب جديد"}</h1>
            <p className="text-muted-foreground">
              {isLogin ? "سجّل دخولك للوصول إلى دوراتك" : "ابدأ رحلة التعلم اليوم"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="الاسم الأول"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="اسم العائلة"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </>
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
            </Button>
          </form>
=======
            <h1 className="text-3xl font-bold">{register ? "مرحباً بعودتك" : "إنشاء حساب جديد"}</h1>
            <p className="text-muted-foreground">
              {isLogin ? "سجّلي دخولك للوصول إلى دوراتك" : "ابدأي رحلة التعلم اليوم"}
            </p>
          </div>

          {registrationSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  تم إرسال رسالة التأكيد!
                </h3>
                <p className="text-green-700 text-sm mb-2">
                  لقد أرسلنا رسالة تأكيد إلى:
                </p>
                <p className="font-semibold text-green-900 mb-3">{registeredEmail}</p>
                <p className="text-green-700 text-sm">
                  يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد لإكمال عملية التسجيل.
                  <br />
                  <span className="text-xs text-green-600 mt-2 block">
                    (تحققي من مجلد الرسائل غير المرغوب فيها إذا لم تجدي الرسالة)
                  </span>
                </p>
              </div>
              <Button 
                onClick={() => {
                  setRegistrationSuccess(false);
                  setIsLogin(true);
                }}
                className="w-full"
                size="lg"
              >
                العودة لتسجيل الدخول
              </Button>
            </div>
          ) : (
            <>
            <form
               onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}
               className="space-y-4"
>
        {!isLogin && (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">الاسم الأول</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="الاسم الأول"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">اسم العائلة</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="اسم العائلة"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </>
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

  <Button type="submit" className="w-full" size="lg" disabled={loading}>
    {loading ? "جاري التحميل..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
  </Button>
</form>
>>>>>>> sara-.D

          <div className="text-center space-y-2">
            <button
              type="button"
<<<<<<< HEAD
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "ليس لديك حساب؟ " : "لديك حساب بالفعل؟ "}
              <span className="text-primary font-semibold">{isLogin ? "سجّل الآن" : "تسجيل الدخول"}</span>
            </button>
          </div>
=======
              onClick={() => {
                setIsLogin((prev) => !prev);
                setRegistrationSuccess(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "ليس لديكي حساب؟ " : "لديكي حساب بالفعل؟ "}
              <span className="text-primary font-semibold">{isLogin ? "سجّلي الآن" : "تسجيل الدخول"}</span>
            </button>
          </div>
            </>
          )}
>>>>>>> sara-.D
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
