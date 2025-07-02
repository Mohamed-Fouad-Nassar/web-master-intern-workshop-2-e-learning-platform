import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema } from "@/validations/QuestionSchema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAddQuestion } from "@/hooks/admin/questions/useAddQuestion";

export default function AddQuestionForm({ exams = [], onSuccess }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      type: "",
      options: [],
      correctAnswer: "",
      exam: "",
      points: "",
    },
  });

  const watchType = watch("type");
  const { mutate: addQuestion, isPending } = useAddQuestion();

  useEffect(() => {
    if (watchType === "true-false") {
      setValue("options", ["True", "False"]);
    } else if (watchType === "short-answer") {
      setValue("options", []);
    } else {
      setValue("options", ["", "", "", ""]);
    }
  }, [watchType, setValue]);

  const handleOptionChange = (index, value) => {
    const current = watch("options") || [];
    const updated = [...current];
    updated[index] = value;
    setValue("options", updated);
  };

  const onSubmitForm = (data) => {
    if (data.type !== "multiple-choice") {
      delete data.options;
    }

    console.log("✅ Submitting question:", data);

    addQuestion(data, {
      onSuccess: () => {
        reset();
        onSuccess?.(); // ✅ Close the form via parent callback
      },
    });
  };

  const onSubmitError = (errors) => {
    console.log("❌ Validation Errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm, onSubmitError)}
      className="space-y-6 bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 p-6 rounded-xl shadow-md border border-border dark:border-gray-700 max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Add New Question</h2>

      {/* Question Text */}
      <div className="space-y-2">
        <Label>Question Text</Label>
        <Textarea {...register("text")} placeholder="Enter the question" />
        {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True / False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
      </div>

      {/* Options */}
      {watchType === "multiple-choice" && (
        <div className="space-y-2">
          <Label>Options</Label>
          {[0, 1, 2, 3].map((idx) => (
            <Input
              key={idx}
              placeholder={`Option ${idx + 1}`}
              value={watch("options")[idx] || ""}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          ))}
          {errors.options && <p className="text-red-500 text-sm">{errors.options.message}</p>}
        </div>
      )}

      {/* Correct Answer */}
      <div className="space-y-2">
        <Label>Correct Answer</Label>
        {watchType === "true-false" ? (
          <Controller
            control={control}
            name="correctAnswer"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="True">True</SelectItem>
                  <SelectItem value="False">False</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <Textarea {...register("correctAnswer")} placeholder="Write the correct answer" />
        )}
        {errors.correctAnswer && (
          <p className="text-red-500 text-sm">{errors.correctAnswer.message}</p>
        )}
      </div>

      {/* Exam */}
      <div className="space-y-2">
        <Label>Exam</Label>
        <Controller
          control={control}
          name="exam"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.exam && <p className="text-red-500 text-sm">{errors.exam.message}</p>}
      </div>

      {/* Points */}
      <div className="space-y-2">
        <Label>Points</Label>
        <Input type="number" {...register("points")} placeholder="e.g. 2" />
        {errors.points && <p className="text-red-500 text-sm">{errors.points.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Question"}
      </Button>
    </form>
  );
}
