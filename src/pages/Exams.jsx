import ExamsList from "@/features/exams/ExamsList";

export default function Exams() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Exams</h1>
      <p className="text-muted-foreground">
        Take your available exams and test your knowledge.
      </p>

      <ExamsList />
    </div>
  );
}