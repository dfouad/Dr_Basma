import { useState } from "react";
import html2pdf from "html2pdf.js";
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
      // ✅ Certificate HTML Template
      const certificateHTML = `
        <div class="certificate" dir="rtl" lang="ar" 
          style="
            width: 1200px;
            height: 850px;
            padding: 60px 80px;
            background: #fff url('/certfication_bg.jpg') no-repeat center;
            background-size: 1000px auto;
            text-align: center;
            font-family: 'Arial', sans-serif;
            border: 16px double #667eea;
            border-radius: 20px;
            position: relative;
          ">
          
       <!-- Name -->
<div 
  style="
    font-size:45px;
    font-weight:bold;
    font-family:'Amiri', serif; 
    color: rgb(97, 122, 144);
    margin:270px auto 10px;  /* reduced top margin from 270px → lifted upward */
    width:fit-content;
    padding:0 20px;
  <!--  border-bottom:2px dotted #aaa;-->
  "
>
  ${userName}
</div>

<!-- Course -->
<p style="font-size:22px;margin-top:10px;margin-bottom:5px;">لإتمام دورة</p>

<div style="font-size:30px;font-weight:700;  font-family:'Amiri', serif;  color: rgb(97, 122, 144); margin:10px auto 0; max-width:80%; ">
  ${courseTitle}
</div>


 <!-- Date -->
<div 
  style="
    position: absolute;
    bottom: 135px;
    right: 430px;  /* move more right by increasing this */
    text-align: right;
    font-family:'Amiri', serif; 
  "
>
  <p style="font-size:25px; color:#555; margin-top:10px;">
    ${new Date().toLocaleDateString("En-EG")}
  </p>
</div>
 </div> `;

      // Create hidden container
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = certificateHTML;
      document.body.appendChild(tempDiv);

      const element = tempDiv.querySelector(".certificate") as HTMLElement;

      // ✅ PDF export options
      const opt = {
        margin: 0,
        filename: `certificate-${courseTitle.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "px", format: [1200, 850] as [number, number], orientation: "landscape" as const },
      };

      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(tempDiv);

      toast({
        title: "تم تحميل الشهادة بنجاح",
        description: "تم حفظها بصيغة PDF.",
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

  if (progress < 100) return null;

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
              onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            />
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>الدورة:</strong> {courseTitle}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={loading || !userName.trim()}>
            {loading ? (
              "جاري التحميل..."
            ) : (
              <>
                <Download className="h-4 w-4 ml-2" />
                تحميل PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDownloadDialog;
