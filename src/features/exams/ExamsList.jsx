import { AlertCircleIcon, Loader2 } from "lucide-react";

import ExamCard from "./ExamCard";
import useExams from "./useExams";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ExamsList() {
  const { isLoading, error, exams } = useExams();

  if (isLoading)
    return <Loader2 className="animate-spin size-8 mx-auto mt-10" />;

  if (error)
    return (
      <Alert className="mt-8" variant="destructive">
        <AlertCircleIcon />
        <AlertDescription>
          {error.message || "Something went wrong, please try again"}
        </AlertDescription>
      </Alert>
    );
  if (!Array.isArray(exams) || exams.length === 0)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">No Exams Available</h1>
        <p className="text-muted-foreground">
          Currently, there are no exams available. Please check back later.
        </p>
      </div>
    );

  return (
    <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {exams.map((exam) => (
        <ExamCard exam={exam} key={exam._id} />
      ))}
    </section>
  );
}