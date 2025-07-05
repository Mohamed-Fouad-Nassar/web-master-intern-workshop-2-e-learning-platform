import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import QuestionCard from '@/components/QuestionCard';
import ExamNavigation from '@/components/ExamNavigation';
import ExamTimer from '@/components/ExamTimer';
import { useExamAnswers } from '@/hooks/useExamAnswers';
import { useExamSubmission } from '@/hooks/useExamSubmission';
import { examApi } from '@/services/ExamAPI';
import { toast } from 'sonner';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const { answers, setAnswer, getAnswer, isComplete, getProgress } = useExamAnswers(questions);
  const { submitExam, isSubmitting } = useExamSubmission(examId, (result) => {
    navigate(`/exam/${examId}/results`);
  });

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const response = await examApi.getExamData(examId);
      
      if (response.success && response.data) {
        const exam = response.data;
        setExamData(exam);
        setQuestions(exam.questions || []);
        setError(null);
      } else {
        throw new Error(response.message || 'Failed to fetch exam data');
      }
    } catch (err) {
      setError('Failed to load exam questions');
      console.error('Error fetching exam:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswer(currentQuestion.id || currentQuestion._id, selectedAnswer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (isComplete()) {
      setShowSubmitConfirm(true);
    } else {
      toast.error('Please answer all questions before submitting');
    }
  };

  const confirmSubmit = () => {
    submitExam(answers);
    setShowSubmitConfirm(false);
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    toast.warning('Time is up! Submitting your exam...');
    submitExam(answers);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-2xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No questions found for this exam. Please contact your instructor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = getProgress();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Exam Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{examData?.title || 'Exam'}</h1>
          {examData?.description && (
            <p className="text-muted-foreground">{examData.description}</p>
          )}
        </div>

        {/* Timer */}
        <ExamTimer 
          examId={examId} 
          duration={examData?.duration || 60}
          onTimeUp={handleTimeUp}
        />

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={getAnswer(currentQuestion.id || currentQuestion._id)}
          onAnswerSelect={handleAnswerSelect}
        />

        {/* Navigation */}
        <ExamNavigation
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          progress={progress}
        />

        {/* Submit Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Progress: {progress.answered}/{progress.total} questions answered
                </div>
                {isComplete() && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">All questions answered</span>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Exam'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Confirmation Dialog */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                  <h3 className="text-lg font-semibold">Submit Exam?</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to submit your exam? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowSubmitConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={confirmSubmit}>
                      Yes, Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}