import { Link } from "react-router";
import { ArrowRightIcon, CalendarIcon, Clock, BookOpen, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";

export default function ExamCard({ exam }) {
  const {
    title,
    description,
    duration,
    questions,
    startDate,
    endDate,
    classLevel,
    isPublished,
    _id: examId,
  } = exam;

  const formattedEndDate = formatDate(endDate);
  const questionsCount = questions?.length || 0;

  // Check if exam is currently available
  const now = new Date();
  const examStartDate = new Date(startDate);
  const examEndDate = new Date(endDate);
  const isAvailable = now >= examStartDate && now <= examEndDate && isPublished;

  return (
    <Card className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex-grow">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-muted-foreground flex items-center text-xs sm:text-sm">
            <CalendarIcon className="size-4 me-2" />
            <span>
              {formattedEndDate
                ? `Due ${formattedEndDate}`
                : "No due date"}
            </span>
          </div>
          {!isPublished && (
            <Badge variant="secondary" className="text-xs">
              Draft
            </Badge>
          )}
        </div>
        
        <div className="mb-2 space-y-0.5">
          <Link
            to={`/studentExam/start/${examId}`}
            className="hover:underline hover:text-primary"
          >
            <h3 className="line-clamp-2 text-base font-semibold capitalize sm:text-lg">
              {title}
            </h3>
          </Link>
          {classLevel && (
            <div className="flex items-center text-xs text-muted-foreground">
              <GraduationCap className="size-3 me-1" />
              <span>{classLevel}</span>
            </div>
          )}
        </div>
        
        <p className="text-muted-foreground line-clamp-2 text-xs sm:line-clamp-3 sm:text-sm mb-3">
          {description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {duration && (
            <div className="flex items-center">
              <Clock className="size-3 me-1" />
              <span>{duration} min</span>
            </div>
          )}
          {questionsCount > 0 && (
            <div className="flex items-center">
              <BookOpen className="size-3 me-1" />
              <span>{questionsCount} questions</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between flex-wrap gap-4">
        <Button 
          size="sm" 
          asChild
          disabled={!isAvailable}
          variant={isAvailable ? "default" : "secondary"}
        >
          <Link
            to={`/studentExam/start/${examId}`}
            className="ms-auto flex items-center justify-center"
          >
            {isAvailable ? "Take Exam" : "Not Available"}
            <ArrowRightIcon className="ms-1 size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}