import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateDownloadDialogProps {
  courseTitle: string;
  courseId: number;
  progress: number;
}

const CertificateDownloadDialog = ({
  courseTitle,
  courseId,
  progress,
}: CertificateDownloadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!userName.trim()) {
      toast({
        title: "يرجى إدخال اسمك",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create a simple certificate as an HTML document
      const certificateHTML = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>شهادة إتمام الدورة</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .certificate {
              background: white;
              max-width: 800px;
              width: 100%;
              padding: 60px 40px;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
            }
            .header {
              border-bottom: 3px solid #667eea;
              padding-bottom: 30px;
              margin-bottom: 40px;
            }
            h1 {
              color: #667eea;
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 18px;
            }
            .content {
              margin: 40px 0;
            }
            .recipient {
              font-size: 20px;
              color: #666;
              margin-bottom: 20px;
            }
            .name {
              font-size: 42px;
              color: #333;
              font-weight: bold;
              margin: 20px 0;
              border-bottom: 2px solid #667eea;
              display: inline-block;
              padding: 10px 40px;
            }
            .course {
              font-size: 24px;
              color: #666;
              margin: 30px 0;
            }
            .course-title {
              color: #667eea;
              font-weight: bold;
            }
            .footer {
              margin-top: 60px;
              padding-top: 30px;
              border-top: 2px solid #f0f0f0;
              display: flex;
              justify-content: space-around;
              align-items: flex-end;
            }
            .signature {
              text-align: center;
            }
            .signature-line {
              border-top: 2px solid #333;
              width: 200px;
              margin: 0 auto 10px;
            }
            .signature-label {
              color: #666;
              font-size: 14px;
            }
            .badge {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 40px;
              color: white;
            }
            @media print {
              body {
                background: white;
              }
              .certificate {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="badge">🏆</div>
            <div class="header">
              <h1>شهادة إتمام</h1>
              <p class="subtitle">Certificate of Completion</p>
            </div>
            
            <div class="content">
              <p class="recipient">هذه الشهادة تمنح لـ</p>
              <div class="name">${userName}</div>
              <p class="course">لإتمام دورة</p>
              <p class="course-title">${courseTitle}</p>
            </div>
            
            <div class="footer">
              <div class="signature">
                <div class="signature-line"></div>
                <p class="signature-label">توقيع المدرب</p>
              </div>
              <div class="signature">
                <div class="signature-line"></div>
                <p class="signature-label">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a blob and download
      const blob = new Blob([certificateHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${courseTitle.replace(/\s+/g, "-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "تم تحميل الشهادة بنجاح",
        description: "يمكنك طباعة الشهادة من المتصفح",
      });
      
      setOpen(false);
      setUserName("");
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "خطأ في التحميل",
        description: "حاول مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Only show for completed courses (100% progress)
  if (progress < 100) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          <Award className="h-4 w-4 ml-2" />
          تحميل الشهادة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تحميل شهادة الإتمام</DialogTitle>
          <DialogDescription>
            أدخل اسمك كما تريد أن يظهر في الشهادة
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              placeholder="أدخل اسمك الكامل"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDownload();
                }
              }}
            />
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>الدورة:</strong> {courseTitle}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={loading || !userName.trim()}
          >
            {loading ? (
              "جاري التحميل..."
            ) : (
              <>
                <Download className="h-4 w-4 ml-2" />
                تحميل الشهادة
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDownloadDialog;
