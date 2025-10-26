import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بعودتك!",
      });
    } catch (error: any) {
      const message = error.response?.data?.detail || "فشل تسجيل الدخول. تحقق من بياناتك.";
      toast({
        title: "خطأ في تسجيل الدخول",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await authAPI.register({
        email,
        password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
      });
      
      // Auto-login after registration
      await login(email, password);
      
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك!",
      });
    } catch (error: any) {
      const message = error.response?.data?.email?.[0] || 
                     error.response?.data?.password?.[0] ||
                     "فشل إنشاء الحساب. حاول مرة أخرى.";
      toast({
        title: "خطأ في التسجيل",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
