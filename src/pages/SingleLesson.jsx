import LessonDetails from "@/components/LessonDetails";
import { LessonReviews } from "@/components/LessonReviews";
import Rating from "@/components/Rating";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useLessons from "@/features/lessons/useLessons";
import image from "@/assets/image.png";
import { AlertCircleIcon, CalendarCheck2, Loader2, User } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router";
import { payLesson } from "@/services/lessonAPI";
import MoreCourses from "@/components/MoreCourses";
import { toast } from "sonner";

const SingleLesson = () => {
  const { id } = useParams();
  const { isLoading, error, lessons } = useLessons();
  const [loading, setLoading] = useState(false);

  if (isLoading || loading)
    return (
      <div className="flex justify-center items-center min-h-[90vh] w-full">
        <Loader2 className="animate-spin size-20 mx-auto mt-10" />
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

  const handleClick = async () => {
    setLoading(true);
    try {
      await payLesson(id).then((res) => {
        window.location.href = res?.paymentUrl;
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddToCart = (lesson) => {
    if (localStorage.getItem("cart")) {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("cart")).filter(
            (item) => item._id !== lesson._id
          ),
          lesson,
        ])
      );
      toast.success("Course added to cart");
    } else {
      localStorage.setItem("cart", JSON.stringify([lesson]));
      toast.success("Course added to cart");
    }
  };

  const lesson = lessons.find((lesson) => lesson._id === id);
  const sections = [
    { id: "details", title: "Details" },
    { id: "instructor", title: "Instructor" },
    { id: "course", title: "Course" },
    { id: "reviews", title: "Reviews" },
  ];

  const data2 = {
    title: "Introduction to User Experience Design",
    desc: "This course is meticulously crafted to provide you with a foundational understanding of the principles, methodologies, and tools that drive exceptional user experiences in the digitallandscape.",
    price: 50,
  };
  return (
    <div className="px-4 w-full">
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start gap-5 max-w-7xl">
        <div className="w-full lg:w-2/3 pt-4">
          <div className="flex flex-col items-start justify-start gap-3">
            <div className="w-full aspect-video md:hidden">
              <img
                src={image}
                alt="Course Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3">
              {lesson.title}
            </h1>
            <p className="w-full lg:max-w-[80%] text-muted-foreground text-sm md:text-base">
              {lesson.description}
            </p>
            <div className="flex items-center text-sm md:text-base flex-wrap">
              <Rating stars={4} /> | <CalendarCheck2 className="mx-2" />{" "}
              {lesson?.scheduledDate?.slice(0, 10)}. {lesson.classLevel}
            </div>
            <div className="flex items-center justify-start gap-2">
              <div className="bg-gray-100 p-2 rounded-full text-black">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-sm md:text-base">
                created By
                <span className="font-semibold text-primary ml-2">
                  John Doe
                </span>
              </span>
            </div>
            <LessonDetails
              description={lesson.description}
              title={lesson.title}
              sections={sections}
            />
          </div>
        </div>

        {/* mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">${lesson.price}</span>
              <span className="text-sm text-muted-foreground line-through">
                ${data2.price * 2}
              </span>
              <span className="text-xs text-green-400">50% Off</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={"default"}
                onClick={() => handleAddToCart(lesson)}
              >
                Add to Cart
              </Button>
              <Button variant={"outline"} onClick={handleClick}>
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop version */}
        <div className="hidden lg:block p-4 rounded-2xl bg-accent mt-2 h-fit w-full lg:w-[350px]">
          <div className="w-full aspect-video">
            <img
              src={image}
              alt="Course Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h1 className="flex flex-wrap gap-3 text-xl md:text-2xl font-bold text-start my-3">
              <span>${lesson.price}</span>
              <span className="text-muted-foreground line-through">
                ${data2.price * 2}
              </span>
              <span className="text-green-400">50% Off</span>
            </h1>
            <div className="flex items-center justify-center flex-col gap-3">
              <Button
                variant={"default"}
                className="w-full"
                onClick={() => handleAddToCart(lesson)}
              >
                Add to Cart
              </Button>
              <Button
                variant={"outline"}
                className="w-full"
                onClick={handleClick}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl mb-20 lg:mb-8">
        <h1
          className="font-extrabold text-xl md:text-2xl mb-3"
          id={sections[3].id}
        >
          {sections[3].title}
        </h1>
        <LessonReviews />
        <MoreCourses id={id} />
      </div>
    </div>
  );
};

export default SingleLesson;
