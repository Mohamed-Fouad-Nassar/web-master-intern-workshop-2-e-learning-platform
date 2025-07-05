import React, { useState, useRef } from "react";
import QuestionsTable from "@/features/admin/QuestionsTable";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuestions } from "@/hooks/admin/questions/useQuestions";
import { useExams } from "@/hooks/admin/exams/useExams";
import AddQuestionForm from "@/features/admin/questions/AddQuestionForm";
import UpdateQuestionForm from "@/features/admin/UpdateQuestionForm";
import ViewQuestionDetails from "@/features/admin/ViewQuestionDetails";

export default function DashQuestions() {
  const { data, isLoading, isError } = useQuestions();
  const { data: exams } = useExams();

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const modalRef = useRef();

  const examIdToTitle = {};
  (exams || []).forEach((exam) => {
    examIdToTitle[exam._id] = exam.title;
  });

  const questionsWithTitles = (data || []).map((q) => ({
    ...q,
    exam: {
      _id: q.exam,
      title: examIdToTitle[q.exam] || "Unknown Exam",
    },
  }));

  const filteredQuestions = questionsWithTitles.filter((q) => {
    const matchExam = selectedExam === "all" || q.exam?.title === selectedExam;
    const matchType = selectedType === "all" || q.type === selectedType;
    return matchExam && matchType;
  });

  const uniqueExams = [
    ...new Set(questionsWithTitles.map((q) => q.exam?.title)),
  ];
  const uniqueTypes = [...new Set(questionsWithTitles.map((q) => q.type))];

  const handleShow = (q) => setViewingQuestion(q);
  const handleEdit = (q) => setEditingQuestion(q);
  const handleDelete = (id) => console.log("Delete question:", id);

  const handleQuestionSubmit = (formData) => {
    console.log("Submitted Question:", formData);
    setShowForm(false);
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowForm(false);
      setEditingQuestion(null);
      setViewingQuestion(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Questions</h1>
        <Button
          className="bg-primary text-white flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add New Question
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {uniqueExams.map((title) => (
                <SelectItem key={title} value={title}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading questions...</p>
      ) : isError ? (
        <p className="text-destructive">Error loading questions</p>
      ) : filteredQuestions.length === 0 ? (
        <p className="text-muted-foreground">No questions found</p>
      ) : (
        <QuestionsTable
          questions={filteredQuestions}
          onShow={handleShow}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Question Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-[#1f2937] rounded-xl p-6 max-w-2xl w-full shadow-lg border border-gray-300 dark:border-gray-700"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <AddQuestionForm
              exams={exams || []}
              onSubmit={handleQuestionSubmit}
            />
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-[#1f2937] rounded-xl p-6 max-w-2xl w-full shadow-lg border border-gray-300 dark:border-gray-700"
          >
            <button
              onClick={() => setEditingQuestion(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <UpdateQuestionForm
              question={editingQuestion}
              onCancel={() => setEditingQuestion(null)}
              onSuccess={(updated) => {
                setEditingQuestion(null);
                console.log("Updated:", updated);
              }}
            />
          </div>
        </div>
      )}

      {/* View Question Modal */}
      {viewingQuestion && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-[#1f2937] rounded-xl p-6 max-w-2xl w-full shadow-lg border border-gray-300 dark:border-gray-700"
          >
            <button
              onClick={() => setViewingQuestion(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <X />
            </button>
            <ViewQuestionDetails question={viewingQuestion} />
          </div>
        </div>
      )}
    </div>
  );
}
