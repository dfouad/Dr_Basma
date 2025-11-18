import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpg";
import api from "@/lib/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('رابط التحقق غير صالح. يرجى التحقق من الرابط والمحاولة مرة أخرى.');
        return;
      }

      try {
        const response = await api.get(`/auth/verify-email/?token=${token}`);
        setStatus('success');
        setMessage(response.data.message || 'تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.');
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error.response?.data?.error || 'حدث خطأ أثناء التحقق من بريدك الإلكتروني. يرجى المحاولة مرة أخرى.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [token]);

  const handleNavigate = () => {
    if (status === 'success') {
      navigate('/auth');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8 space-y-6">
          <div className="text-center space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="دكتور سعادة" className="h-16 w-auto" />
              <span className="text-2xl font-bold">دكتور سعادة</span>
            </Link>

            {status === 'loading' && (
              <>
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <h1 className="text-2xl font-bold">جاري التحقق من بريدك الإلكتروني...</h1>
                <p className="text-muted-foreground">يرجى الانتظار قليلاً</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-green-600">تم التأكيد بنجاح!</h1>
                <p className="text-muted-foreground">{message}</p>
                <Button 
                  onClick={handleNavigate}
                  className="w-full mt-4"
                  size="lg"
                >
                  تسجيل الدخول الآن
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <XCircle className="h-16 w-16 text-red-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-red-600">فشل التحقق</h1>
                <p className="text-muted-foreground">{message}</p>
                <div className="space-y-2 mt-4">
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="w-full"
                    size="lg"
                  >
                    تسجيل مرة أخرى
                  </Button>
                  <Button 
                    onClick={handleNavigate}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    العودة للرئيسية
                  </Button>
                </div>
              </>
            )}
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

export default VerifyEmail;
