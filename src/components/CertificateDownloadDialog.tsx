import { useState, useEffect } from "react";
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
import { Award, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {certificatesAPI} from "@/lib/api";
import api from "@/lib/api";

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
  const [issued, setIssued] = useState(false);
  const { toast } = useToast();

  // ======================================
  // ✅ Correct backend check (not admin)
  // ======================================
useEffect(() => {
  const checkCertificateStatus = async () => {
    try {
      const res = await certificatesAPI.getUserCertificates();

      const list = res.data.results ?? res.data;   // supports paginated & non-paginated API

      const exists = list.some((cert: any) => cert.course === courseId);

      if (exists) {
        setIssued(true);
        localStorage.setItem("issuedCertificates", JSON.stringify([courseId]));
      } else {
        setIssued(false);
        localStorage.setItem("issuedCertificates", JSON.stringify([]));
      }

    } catch (error) {
      console.warn("Backend unreachable, using localStorage fallback.");

      const local = JSON.parse(localStorage.getItem("issuedCertificates") || "[]");
      setIssued(local.includes(courseId));
    }
  };

  checkCertificateStatus();
}, [courseId]);


  // ======================================
  // Handle PDF download
  // ======================================
  const handleDownload = async () => {
    if (!userName.trim()) {
      toast({ title: "يرجى إدخال اسمك", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Generate PDF
      const html = `
        <div class="certificate" dir="rtl" lang="ar" 
          style="
            width: 1200px;
            height: 850px;
            padding: 60px 80px;
            background: #fff url('/certfication_bg.jpg') no-repeat center;
            background-size: 1000px auto;
            text-align: center;
            font-family: 'Amiri', serif;
            border: 16px double #667eea;
            border-radius: 20px;
            position: relative;">
          
          <div style="
              font-size:45px; font-weight:bold; color: rgb(97, 122, 144);
              margin:280px auto 10px;">
            ${userName}
          </div>

          <p style="font-size:22px;color:#8B4D8B;">
            تُمنح هذه الشهادة تقديرًا لاجتهادها وإتمامها متطلبات البرنامج التدريبي بنجاح
          </p>

          <div style="font-size:30px;color:#8B4D8B;font-weight:700;">
            برنامج ${courseTitle}
          </div>

          <div style="position:absolute;bottom:135px;right:430px;">
            <p style="font-size:25px;color:#555;">
              ${new Date().toLocaleDateString("ar-AR")}
            </p>
          </div>
        </div>`;

      const temp = document.createElement("div");
      temp.innerHTML = html;
      document.body.appendChild(temp);

      const certificateEl = temp.querySelector(".certificate") as HTMLElement | null;
      if (!certificateEl) {
        document.body.removeChild(temp);
        throw new Error("Certificate element not found");
      }

      await html2pdf()
        .from(certificateEl)
        .set({
          margin: 0,
          filename: `certificate-${courseTitle}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "px", format: [1200, 850], orientation: "landscape" },
        })
        .save();

      document.body.removeChild(temp);

      // Save to backend
      await certificatesAPI.create({
  course_id: courseId,
  full_name: userName, 
});


      // Save to localStorage
      const local = JSON.parse(localStorage.getItem("issuedCertificates") || "[]");
      if (!local.includes(courseId)) {
        local.push(courseId);
        localStorage.setItem("issuedCertificates", JSON.stringify(local));
      }

      setIssued(true);
      setOpen(false);
      setUserName("");

      toast({ title: "تم تحميل الشهادة بنجاح" });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الشهادة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // UI Conditions
  // ======================================
  if (progress < 100) return null;

  if (issued) {
    return (
      <Button variant="default" className="w-full mt-2" disabled>
        <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
        تم إصدار الشهادة
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          <Award className="h-4 w-4 ml-2" />
          تحميل الشهادة
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>تحميل شهادة الإتمام</DialogTitle>
          <DialogDescription>أدخل اسمك كما تريد أن يظهر</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label>الاسم الكامل</Label>
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>

        <DialogFooter>
          <Button disabled={!userName.trim() || loading} onClick={handleDownload}>
            {loading ? "جاري التحميل..." : "تحميل PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDownloadDialog;
