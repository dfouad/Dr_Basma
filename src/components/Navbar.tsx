import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  // Mock authentication - in real app, this would come from auth context
  const isAuthenticated = false;

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="سنوات" className="h-12 w-auto" />
            <span className="text-xl font-bold text-foreground">سنوات</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              الدورات
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              عن المنصة
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    لوحة التحكم
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    إنشاء حساب
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
