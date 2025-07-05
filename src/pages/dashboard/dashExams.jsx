import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import ExamsTable from "@/features/admin/ExamsTable";
import AddExamModal from "@/features/admin/exams/AddExamModal";

import { useExams } from "@/hooks/admin/exams/useExams";

export default function DashExams() {
  const { data, isLoading, isError } = useExams();

  const [selectedClassLevel, setSelectedClassLevel] = useState("all");

  const exams = data || [];
  const allClassLevels = Array.from(
    new Set(exams.map((exam) => exam.classLevel))
  );

  const filteredExams =
    selectedClassLevel === "all"
      ? exams
      : exams.filter((exam) => exam.classLevel === selectedClassLevel);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Exams</h1>
        <AddExamModal />
      </div>

      <div className="w-[200px]">
        <Select
          value={selectedClassLevel}
          onValueChange={setSelectedClassLevel}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {allClassLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin size-10 my-20 mx-auto" />
      ) : isError ? (
        <p className="text-destructive">Error loading exams</p>
      ) : filteredExams.length === 0 ? (
        <p className="text-muted-foreground">No exams found</p>
      ) : (
        <ExamsTable exams={filteredExams} />
      )}
    </div>
  );
}
