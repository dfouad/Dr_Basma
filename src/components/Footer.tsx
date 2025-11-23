import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import logo from "@/assets/logo.png";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="د. بسمة كمال" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              منصة تعليمية متميزة تقدم دورات تدريبية احترافية لتطوير مهاراتك وتحقيق أهدافك.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  العودة للرئيسية
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  تصفح الدورات
                </Link>
              </li>
              
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">تواصلي معنا</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100088086409991"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                
                <Facebook className="h-5 w-5" />
                 </a>
              <button
  type="button"
  onClick={() =>
    window.open("https://wa.me/201555676851", "_blank", "noopener,noreferrer")
  }
  aria-label="WhatsApp"
  className="text-muted-foreground hover:text-primary transition-colors"
>
  <FaWhatsapp className="h-5 w-5" />
</button>


              <a
                href="https://www.instagram.com/dr.basmakamal?igsh=MTNiZGpybG1taXBrbQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
             
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} د. بسمة كمال. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
