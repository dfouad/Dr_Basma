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
<<<<<<< HEAD
=======
import {certificatesAPI} from "@/lib/api";
import api from "@/lib/api";
>>>>>>> sara-.D

interface CertificateDownloadDialogProps {
  courseTitle: string;
  courseId: number;
  progress: number;
}

<<<<<<< HEAD
=======

>>>>>>> sara-.D
const CertificateDownloadDialog = ({
  courseTitle,
  courseId,
  progress,
}: CertificateDownloadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [issued, setIssued] = useState(false); // ✅ track if certificate issued
  const { toast } = useToast();

  // ✅ Check if already issued (from localStorage)
  useEffect(() => {
    const issuedCourses = JSON.parse(localStorage.getItem("issuedCertificates") || "[]");
    if (issuedCourses.includes(courseId)) {
      setIssued(true);
    }
  }, [courseId]);

  const handleDownload = async () => {
    if (!userName.trim()) {
      toast({
        title: "يرجى إدخال اسمك",
        variant: "destructive",
      });
=======
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
>>>>>>> sara-.D
      return;
    }

    setLoading(true);
<<<<<<< HEAD
    try {
      // ✅ Certificate HTML Template
      const certificateHTML = `
=======

    try {
      // Generate PDF
      const html = `
>>>>>>> sara-.D
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
<<<<<<< HEAD
            position: relative;
          ">
          
          <!-- Name -->
          <div 
            style="
              font-size:45px;
              font-weight:bold;
              color: rgb(97, 122, 144);
              margin:280px auto 10px;
              width:fit-content;
              padding:0 20px;
            "
          >
            ${userName}
          </div>

          <!-- Course -->
          <p style="font-size:22px;margin-top:20px;margin-bottom:5px;
              color: #8B4D8B;">تُمنح هذه الشهادة تقديرًا لاجتهادها وإتمامها متطلبات البرنامج التدريبي بنجاح
          </p>

          <div style="font-size:30px;font-weight:700;color: #8B4D8B;
              margin:20px auto 0; max-width:80%;">
             برنامج  ${courseTitle}
          </div>

          <!-- Date -->
          <div 
            style="
              position: absolute;
              bottom: 135px;
              right: 430px;
              text-align: right;
            "
          >
            <p style="font-size:25px; color:#555; margin-top:10px;">
              ${new Date().toLocaleDateString("en-EG")}
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
        jsPDF: {
          unit: "px",
          format: [1200, 850] as [number, number],
          orientation: "landscape" as const,
        },
      };

      await html2pdf().set(opt).from(element).save();
      document.body.removeChild(tempDiv);

      toast({
        title: "تم تحميل الشهادة بنجاح",
        description: "تم حفظها بصيغة PDF.",
      });

      // ✅ Mark certificate as issued in localStorage
      const issuedCourses = JSON.parse(localStorage.getItem("issuedCertificates") || "[]");
      if (!issuedCourses.includes(courseId)) {
        issuedCourses.push(courseId);
        localStorage.setItem("issuedCertificates", JSON.stringify(issuedCourses));
=======
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
>>>>>>> sara-.D
      }

      setIssued(true);
      setOpen(false);
      setUserName("");
<<<<<<< HEAD
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "خطأ في التحميل",
        description: "حاول مرة أخرى",
=======

      toast({ title: "تم تحميل الشهادة بنجاح" });
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الشهادة",
>>>>>>> sara-.D
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Hide completely if not complete
  if (progress < 100) return null;

  // ✅ Show "تم إصدار الشهادة" if already issued
=======
  // ======================================
  // UI Conditions
  // ======================================
  if (progress < 100) return null;

>>>>>>> sara-.D
  if (issued) {
    return (
      <Button variant="default" className="w-full mt-2" disabled>
        <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
        تم إصدار الشهادة
      </Button>
    );
  }

<<<<<<< HEAD
  // Otherwise, show the download dialog
=======
>>>>>>> sara-.D
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">
          <Award className="h-4 w-4 ml-2" />
          تحميل الشهادة
        </Button>
      </DialogTrigger>
<<<<<<< HEAD
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
=======

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
>>>>>>> sara-.D
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateDownloadDialog;
