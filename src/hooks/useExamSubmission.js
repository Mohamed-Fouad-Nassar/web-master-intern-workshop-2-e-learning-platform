import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { examApi } from '@/services/ExamAPI';
import { toast } from 'sonner';

export function useExamSubmission(examId, onSuccess) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: (answers) => examApi.submitExam(examId, answers),
    onMutate: () => setIsSubmitting(true),
    onSuccess: (data) => {
      setIsSubmitting(false);

      if (data.success) {
        toast.success(data.message || 'Exam submitted successfully!');
        onSuccess?.(data);
      } else {
        toast.error(data.message || 'Failed to submit exam');
      }
    },
    onError: (error) => {
      setIsSubmitting(false);
      const errorMessage = error.response?.data?.message || 'Failed to submit exam. Please try again.';
      toast.error(errorMessage);
      console.error('Submission error:', error);
    },
  });

  const submitExam = (answers) => {
    const formattedAnswers = Array.isArray(answers) ? answers : 
      Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

    mutation.mutate(formattedAnswers);
  };

  return {
    submitExam,
    isSubmitting,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data
  };
}