import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";

// Utility function to get full image URL
const getFullImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  return `${baseURL}${url}`;
};

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoCount: number;
  thumbnail?: string; // optional image
}

const CourseCard = ({
  id,
  title,
  description,
  duration,
  videoCount,
  thumbnail,
}: CourseCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
      {/* 🖼 Course image area */}
      <div className="relative overflow-hidden bg-muted aspect-[16/9]">
        <img
          src={thumbnail ? getFullImageUrl(thumbnail) : "/assets/default-course.jpg"}
          alt={title || "Course placeholder"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-100"
          onError={(e) => {
            e.currentTarget.src = "/assets/default-course.jpg";
          }}
        />

        {/* 🌗 Always-visible gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 📝 Optional fallback text if no thumbnail */}
        {!thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium bg-black/30">
            لا توجد صورة متاحة
          </div>
        )}
      </div>

      {/* 📋 Course info */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            <span>{videoCount} فيديو</span>
          </div>
        </div>

        <Link to={`/courses/${id}`}>
          <Button className="w-full" variant="default">
            عرض الدورة
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
