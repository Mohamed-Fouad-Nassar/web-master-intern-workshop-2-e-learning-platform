import { useState, useCallback } from 'react';

export function useExamAnswers(questions = []) {
  const [answers, setAnswers] = useState({});

  // Set answer for a specific question
  const setAnswer = useCallback((questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  }, []);

  // Get answer for a specific question
  const getAnswer = useCallback((questionId) => {
    return answers[questionId] || null;
  }, [answers]);

  // Check if all questions are answered
  const isComplete = useCallback(() => {
    return questions.every(question => {
      const questionId = question._id || question.id;
      return answers[questionId];
    });
  }, [questions, answers]);

  // Get progress stats
  const getProgress = useCallback(() => {
    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;
    const percentage = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    
    return {
      answered: answeredCount,
      total: totalCount,
      remaining: totalCount - answeredCount,
      percentage
    };
  }, [questions, answers]);

  // Clear all answers
  const clearAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  const getAnswersForSubmission = useCallback(() => {
    return Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer
    }));
  }, [answers]);

  return {
    answers,
    setAnswer,
    getAnswer,
    isComplete,
    getProgress,
    clearAnswers,
    getAnswersForSubmission
  };
}