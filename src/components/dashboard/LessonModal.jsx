import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pen, PlusCircle } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "./DatePicker";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonFormSchema } from "@/validations/LessonFormSchema";
import useCreateLesson from "@/features/lesson/useCreateLesson";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLesson } from "@/services/lessonAPI";
// import useLessons from "@/features/lessons/useLessons";

export function LessonModalFrom({ use, id, paginatedLessons }) {
  const { mutateAsync: createLesson } = useCreateLesson();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = new Date();
  const [date, setDate] = useState(today);
  const [dateError, setDateError] = useState(false);
  const formattedDate = new Date(date).toISOString().split("T")[0];
  // const { lessons } = useLessons();
  const [lessonToEdit, setLessonToEdit] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      Title: "",
      Video: "",
      Price: "",
      description: "",
      "Class Level": "",
    },
  });

  // Reset form with lesson data when editing
  useEffect(() => {
    if (isDialogOpen && use === "Edit") {
      const lesson = paginatedLessons.find((lesson) => lesson._id == id);
      setLessonToEdit(lesson);
    }
  }, [isDialogOpen, use, id, paginatedLessons]);

  useEffect(() => {
    if (lessonToEdit) {
      reset({
        Title: lessonToEdit.title,
        Video: lessonToEdit.video,
        Price: lessonToEdit.price,
        description: lessonToEdit.description,
        "Class Level": lessonToEdit.classLevel,
      });
      if (lessonToEdit.scheduledDate) {
        setDate(new Date(lessonToEdit.scheduledDate));
      }
    }
  }, [lessonToEdit, reset]);

  useEffect(() => {
    if (date && date < today) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  }, [date]);

  const inputs = [
    { name: "Title", placeholder: "Enter lesson title" },
    { name: "Video", placeholder: "Enter video URL" },
    { name: "Price", placeholder: "Enter lesson price" },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        title: data.Title,
        description: data.description,
        video: data.Video,
        classLevel: data["Class Level"],
        scheduledDate: formattedDate,
        price: data.Price,
      };

      const updatedPayload = {
        title: data.Title,
        description: data.description,
        video: data.Video,
        classLevel: data["Class Level"],
        price: data.Price,
      };

      if (use === "Add") {
        await createLesson(payload);
        console.log("Lesson created:", payload);
      } else if (use === "Edit") {
        await updateLesson(id, updatedPayload);
        window.location.reload();
        console.log("Lesson updated:", updatedPayload);
      }

      reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && use === "Add") {
    return (
      <div className="flex justify-center items-center min-h-[90vh] w-full">
        <Loader2 className="animate-spin size-8 mx-auto mt-10" />
      </div>
    );
  }

  return (
    <Dialog onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={use === "Add" ? "default" : "sm"}
          variant={use === "Add" ? "default" : "ghost"}
          className={
            use === "Add" ? `bg-primary text-white flex items-center gap-2` : ""
          }
        >
          {use === "Add" ? (
            <>
              <PlusCircle size={16} />
              Add New Lesson
            </>
          ) : (
            <Pen size={16} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{use} Lesson</DialogTitle>
            <DialogDescription>{use} your Lesson here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 my-4">
            {inputs.map((input, index) => (
              <div key={index} className="grid gap-3">
                <Label htmlFor={input.name}>
                  {input.name.replace("-", " ")}
                </Label>
                <Input
                  id={input.name}
                  placeholder={input.placeholder}
                  type={input.name === "Price" ? "number" : "text"}
                  {...register(input.name)}
                />
                {errors[input.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[input.name].message}
                  </p>
                )}
              </div>
            ))}
            <div>
              <Controller
                name="Class Level"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grades</SelectLabel>
                        <SelectItem value="Grade 1 Secondary">
                          Grade 1
                        </SelectItem>
                        <SelectItem value="Grade 2 Secondary">
                          Grade 2
                        </SelectItem>
                        <SelectItem value="Grade 3 Secondary">
                          Grade 3
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors["Class Level"] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors["Class Level"].message}
                </p>
              )}
            </div>

            {use === "Add" && (
              <div>
                <DatePicker date={date} setDate={setDate} />
                {dateError && (
                  <p className="text-red-500 text-sm mt-1">
                    Scheduled date cannot be in the past.
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="description-1">Description</Label>
              <Textarea
                id="description-1"
                placeholder="Enter lesson description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{use === "Add" ? "Add" : "Update"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
