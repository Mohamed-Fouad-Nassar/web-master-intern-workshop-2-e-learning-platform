import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import AddQuestionForm from "@/features/admin/questions/AddQuestionForm";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export default function ViewExamDetails({ exam }) {
  const [showForm, setShowForm] = useState(false);
  const modalRef = useRef(null);

  const handleQuestionSubmit = (formData) => {
    console.log("New Question Submitted:", formData);
    setShowForm(false);
  };

  // Close modal on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowForm(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showForm]);

  if (!exam)
    return <p className="text-muted-foreground">No exam data available</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Exam Info */}
      <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 shadow-md border border-border dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
        <p className="text-muted-foreground mb-4">{exam.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Class Level:</strong> {exam.classLevel}
          </p>
          <p>
            <strong>Duration:</strong> {exam.duration} mins
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {exam.isPublished ? (
              <Badge className="bg-green-600">Published</Badge>
            ) : (
              <Badge className="bg-yellow-500">Draft</Badge>
            )}
          </p>
          <p>
            <strong>Start:</strong>{" "}
            {dayjs(exam.startDate).format("MMMM D, YYYY")}
          </p>
          <p>
            <strong>End:</strong> {dayjs(exam.endDate).format("MMMM D, YYYY")}
          </p>
          <p>
            <strong>Total Questions:</strong> {exam.questions.length}
          </p>
        </div>
      </div>

      {/* Add New Question Button */}
      <div className="flex justify-end">
        <Button
          className="bg-primary text-white flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add New Question
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Questions</h3>
        {exam.questions.map((q, idx) => (
          <div
            key={q._id}
            className="border border-border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-[#1f2937] shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">
                {idx + 1}. {q.text}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({q.type}, {q.points} pts)
              </span>
            </div>

            {q.type === "multiple-choice" && (
              <ul className="list-disc list-inside space-y-1 pl-4">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`${
                      opt === q.correctAnswer
                        ? "font-bold text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            {q.type === "true-false" && (
              <p>
                <strong>Correct Answer:</strong>{" "}
                <span className="text-green-600 dark:text-green-400">
                  {q.correctAnswer}
                </span>
              </p>
            )}

            {q.type === "short-answer" && (
              <p>
                <strong>Expected Answer:</strong>{" "}
                <span className="italic text-muted-foreground">
                  {q.correctAnswer}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Add Question Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-white dark:bg-[#1f2937] p-6 rounded-xl shadow-lg border border-border w-full max-w-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            {/* Add Question Form */}
            <AddQuestionForm
              exams={[{ _id: exam._id, title: exam.title }]}
              onSubmit={handleQuestionSubmit}
              defaultExamId={exam._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
