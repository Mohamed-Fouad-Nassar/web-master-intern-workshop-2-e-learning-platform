import { useQuery } from "@tanstack/react-query";
import { examApi } from "@/services/ExamAPI";

export default function useExams() {
  const {
    isLoading,
    error,
    data: response,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: examApi.getAllExams,
  });

  const exams = response?.data || [];

  return { isLoading, error, exams };
}