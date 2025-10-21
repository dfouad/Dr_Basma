import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Users, Video } from "lucide-react";

const Dashboard = () => {
  const handleVideoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle video upload logic
    console.log("Video upload submitted");
  };

  const handleUserEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle user enrollment logic
    console.log("User enrollment submitted");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage courses and user enrollments</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Video Section */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Upload Video</h2>
                </div>

                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseSelect">Select Course</Label>
                    <Select>
                      <SelectTrigger id="courseSelect">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Leadership Mastery</SelectItem>
                        <SelectItem value="2">Communication Excellence</SelectItem>
                        <SelectItem value="3">Mindset & Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">Video Title</Label>
                    <Input id="videoTitle" placeholder="Enter video title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">Description</Label>
                    <Textarea
                      id="videoDescription"
                      placeholder="Brief description of the video"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoFile">Video File</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV up to 500MB</p>
                      <input
                        id="videoFile"
                        type="file"
                        accept="video/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Upload Video
                  </Button>
                </form>
              </div>

              {/* Enroll User Section */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold">Enroll User</h2>
                </div>

                <form onSubmit={handleUserEnrollment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">User Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="user@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollCourse">Course to Enroll</Label>
                    <Select>
                      <SelectTrigger id="enrollCourse">
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Leadership Mastery</SelectItem>
                        <SelectItem value="2">Communication Excellence</SelectItem>
                        <SelectItem value="3">Mindset & Performance</SelectItem>
                        <SelectItem value="4">Time Management Pro</SelectItem>
                        <SelectItem value="5">Emotional Intelligence</SelectItem>
                        <SelectItem value="6">Goal Setting & Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNote">Note (Optional)</Label>
                    <Textarea
                      id="enrollmentNote"
                      placeholder="Add a note for the user"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" variant="secondary">
                    Enroll User
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The user will receive an email notification upon enrollment.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Courses</p>
                <p className="text-3xl font-bold">6</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Videos</p>
                <p className="text-3xl font-bold">125</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-1">Enrolled Users</p>
                <p className="text-3xl font-bold">248</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
