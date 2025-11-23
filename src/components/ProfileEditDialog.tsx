import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/lib/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface ProfileEditDialogProps {
  user: User;
  onUpdate: () => void;
}

const ProfileEditDialog = ({ user, onUpdate }: ProfileEditDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // separate loading for each tab (optional but nicer UX)
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile form state
  const [email, setEmail] = useState(user.email || "");
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // basic email validation
    if (!email.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "خطأ",
        description: "صيغة البريد الإلكتروني غير صحيحة",
        variant: "destructive",
      });
      return;
    }

    setProfileLoading(true);

    try {
      await authAPI.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
      });

      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });

      onUpdate();    // refresh profile data in parent
      setOpen(false);
    } catch (error: any) {
      const data = error?.response?.data;
      const emailError =
        data?.email?.[0] ||
        data?.detail ||
        data?.message ||
        "حاولي مرة أخرى لاحقاً";

      toast({
        title: "خطأ في التحديث",
        description: emailError,
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      await authAPI.changePassword(oldPassword, newPassword);

      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم حفظ كلمة المرور الجديدة بنجاح",
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const data = error?.response?.data;
      const msg =
        data?.old_password?.[0] ||
        data?.detail ||
        data?.message ||
        "حاولي مرة أخرى لاحقاً";

      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">تعديل الملف الشخصي</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            حدثي معلوماتك الشخصية أو تغيير كلمة المرور
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">المعلومات الشخصية</TabsTrigger>
            <TabsTrigger value="password">كلمة المرور</TabsTrigger>
          </TabsList>

          {/* معلومات شخصية */}
          <TabsContent value="profile" className="space-y-4 pt-4">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                  onChange={(e) => setEmail(e.target.value)}
                  
                />
                  <p className="text-xs text-muted-foreground">
                  لا يمكن تغيير البريد الإلكتروني
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">الاسم الأول</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="أدخلي الاسم الأول"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">اسم العائلة</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="أدخلي اسم العائلة"
                />
              </div>

              <Button type="submit" className="w-full" disabled={profileLoading}>
                {profileLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </form>
          </TabsContent>

          {/* تغيير كلمة المرور */}
          <TabsContent value="password" className="space-y-4 pt-4">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">كلمة المرور الحالية</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="أدخلي كلمة المرور الحالية"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخلي كلمة المرور الجديدة"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعيدي إدخال كلمة المرور الجديدة"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={passwordLoading}>
                {passwordLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
