import { AccordionDemo } from "@/components/AccordionDemo";
import LessonDetails from "@/components/LessonDetails";
import { LessonReviews } from "@/components/LessonReviews";
import MoreCourses from "@/components/MoreCourses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePaidLesson } from "@/features/lesson/usePaidLesson";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import React from "react";
import { useParams } from "react-router";

function PaidLesson() {
  const { id } = useParams();
  const { data, error, isLoading } = usePaidLesson(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[90vh] w-full">
        <Loader2 className="animate-spin size-8 mx-auto mt-10" />
      </div>
    );

  if (error)
    return (
      <Alert className="mt-8" variant="destructive">
        <AlertCircleIcon />
        <AlertDescription>
          Something went wrong, please try again
        </AlertDescription>
      </Alert>
    );
  const sections = [
    { id: "details", title: "Details" },
    { id: "instructor", title: "Instructor" },
    { id: "course", title: "Course" },
    { id: "reviews", title: "Reviews" },
  ];

  const extractVideoId = (url) => {
    if (!url) return "";
    const match = url.match(/(?:youtu\.be\/|v=)([^&]+)/);
    return match ? match[1] : "";
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{data?.title}</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(
                  data?.video
                )}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg w-full h-full"
              ></iframe>
            </div>
            <LessonDetails
              description={data.description}
              title={data.title}
              sections={sections}
              use="paid"
            />
            <div id="course" className="w-full lg:w-1/3 md:hidden">
              <h1 className="font-extrabold text-2xl mb-3" id={sections[2].id}>
                {sections[2].title}
              </h1>
              <AccordionDemo title={data.title} disabled={false} />
            </div>
          </div>
          <div id="course" className="w-full lg:w-1/3 max-md:hidden">
            <h1 className="font-extrabold text-2xl mb-3" id={sections[2].id}>
              {sections[2].title}
            </h1>
            <AccordionDemo title={data.title} disabled={false} />
          </div>
        </div>
        <div className="mt-8">
          <h1 className="font-extrabold text-2xl mb-3" id={sections[3].id}>
            {sections[3].title}
          </h1>
          <LessonReviews />
        </div>
        <div className="w-full">
          <MoreCourses id={id} />
        </div>
      </div>
    </div>
  );
}

export default PaidLesson;
