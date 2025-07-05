import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExamAPI } from "@/services/AdminAPI";
import { toast } from "sonner";

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId) => {
      const response = await deleteExamAPI(examId);
      if (!response.success) {
        throw new Error(response.message || "Failed to delete exam");
      }
      return response;
    },
    onSuccess: () => {
      toast.success("Exam deleted successfully ✅");
      queryClient.invalidateQueries(["exams"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error deleting exam ❌");
    },
  });
}
