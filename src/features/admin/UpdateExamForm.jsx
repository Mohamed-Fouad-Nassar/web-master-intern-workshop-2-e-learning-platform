import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { examSchema } from "@/validations/ExamSchema";
import { useUpdateExam } from "@/hooks/admin/exams/useUpdateExam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import AddQuestionForm from "@/features/admin/questions/AddQuestionForm";
import UpdateQuestionForm from "@/features/admin/UpdateQuestionForm";
import LoadingButton from "@/components/LoadingButton";
// import useExam from "./exams/useExam";

export default function UpdateExamForm({ exam }) {
  // const { isLoadingExam, exam, error } = useExam(examId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam?.title || "",
      description: exam?.description || "",
      duration: exam?.duration || "",
      classLevel: exam?.classLevel || "",
      startDate: exam?.startDate?.slice(0, 10) || "",
      endDate: exam?.endDate?.slice(0, 10) || "",
      isPublished: exam?.isPublished || false,
    },
  });

  const { mutate: updateExam, isPending } = useUpdateExam();

  const [questions, setQuestions] = useState(exam?.questions || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q))
    );
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  const onSubmitForm = (data) => {
    const { startDate, endDate, ...rest } = data;

    updateExam({
      examId: exam._id,
      data: {
        ...rest,
        duration: Number(data.duration),
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6 w-full mx-auto"
    >
      <div className="space-y-2">
        <label className="block font-medium">Exam Title</label>
        <Input {...register("title")} />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <Textarea {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Duration (minutes)</label>
        <Input type="number" {...register("duration")} />
        {errors.duration && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Class Level</label>
        <Select onValueChange={(val) => setValue("classLevel", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Class Level" />
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

      <div className="flex items-center gap-3">
        <span>Published:</span>
        <Switch
          checked={watch("isPublished")}
          onCheckedChange={(val) => setValue("isPublished", val)}
        />
      </div>

      {/* Dates still shown in form but not submitted */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-medium">Start Date</label>
          <Input type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block font-medium">End Date</label>
          <Input type="date" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-white flex items-center gap-2"
          >
            <Plus size={16} /> Add New Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <p className="text-muted-foreground">No questions added yet.</p>
        ) : (
          questions.map((q, i) => (
            <div
              key={q._id}
              className="p-4 border rounded-md bg-white dark:bg-[#1f2937]"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    {i + 1}. {q.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {q.type} | Points: {q.points}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingQuestion(q)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <LoadingButton type="submit" loading={isPending}>
        Update Exam
      </LoadingButton>

      {/* Add Question Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <AddQuestionForm
              examId={exam._id}
              onCancel={() => setShowAddForm(false)}
              onSuccess={(newQ) => {
                setQuestions((prev) => [...prev, newQ]);
                setShowAddForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <button
              onClick={() => setEditingQuestion(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <UpdateQuestionForm
              question={editingQuestion}
              onCancel={() => setEditingQuestion(null)}
              onSuccess={(updated) => handleUpdateQuestion(updated)}
            />
          </div>
        </div>
      )}
    </form>
  );
}
