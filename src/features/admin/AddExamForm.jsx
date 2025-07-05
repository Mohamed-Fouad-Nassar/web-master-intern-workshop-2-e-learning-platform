import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { examSchema } from "@/validations/ExamSchema";
import LoadingButton from "@/components/LoadingButton";

import { useAddExam } from "@/hooks/admin/exams/useAddExam";

export default function AddExamForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      classLevel: "",
      startDate: "",
      endDate: "",
      isPublished: false,
    },
  });

  const isPublished = watch("isPublished");

  const { mutate: addExam, isPending: isLoading } = useAddExam();

  const onSubmit = (formData) => {
    formData.duration = Number(formData.duration);

    // convert date strings to ISO if needed
    if (formData.startDate)
      formData.startDate = new Date(formData.startDate).toISOString();
    if (formData.endDate)
      formData.endDate = new Date(formData.endDate).toISOString();

    console.log("Submitting formData:", formData);
    addExam(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Exam Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter exam title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Brief description of the exam"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input
          type="number"
          id="duration"
          {...register("duration")}
          placeholder="e.g. 60"
        />
        {errors.duration && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      {/* Class Level */}
      <div className="space-y-2">
        <Label>Class Level</Label>
        <Select onValueChange={(val) => setValue("classLevel", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grade 1 Secondary">Grade 1 Secondary</SelectItem>
            <SelectItem value="Grade 2 Secondary">Grade 2 Secondary</SelectItem>
            <SelectItem value="Grade 3 Secondary">Grade 3 Secondary</SelectItem>
          </SelectContent>
        </Select>
        {errors.classLevel && (
          <p className="text-red-500 text-sm">{errors.classLevel.message}</p>
        )}
      </div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input type="date" id="startDate" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input type="date" id="endDate" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Switch */}
      <div className="flex items-center gap-4">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={(checked) => setValue("isPublished", checked)}
        />
        <Label htmlFor="isPublished">Publish Exam</Label>
      </div>

      <LoadingButton type="submit" className="w-full" loading={isLoading}>
        Submit Exam
      </LoadingButton>
    </form>
  );
}
