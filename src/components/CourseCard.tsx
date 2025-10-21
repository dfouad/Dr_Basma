import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle } from "lucide-react";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoCount: number;
  thumbnail?: string;
}

const CourseCard = ({ id, title, description, duration, videoCount, thumbnail }: CourseCardProps) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border">
      <div className="relative overflow-hidden bg-muted aspect-video">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

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
