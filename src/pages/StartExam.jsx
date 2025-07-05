import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, FileText, Users, AlertTriangle, Loader2 } from "lucide-react";
import { examApi } from '@/services/ExamAPI';
import { toast } from 'sonner';

export default function StartExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      let data;
      try {
        data = await examApi.getExamDetails(examId);
      } catch (err) {
        console.log('Exam details not available, fetching from all exams');
        const allExams = await examApi.getAllExams();
        const exams = allExams.data || allExams;
        const exam = exams.find(e => e._id === examId);
        if (exam) {
          data = { data: { exam } };
        } else {
          throw new Error('Exam not found');
        }
      }
      const examData = data.data?.exam || data.exam || data;
      setExamDetails(examData);
      setError(null);
    } catch (err) {
      setError('Failed to load exam details');
      console.error('Error fetching exam details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = async () => {
    setIsStarting(true);
    try {
      const response = await examApi.startExam(examId);
      
      if (response.success) {
        toast.success('Exam started successfully!');
        
        // Navigate to the exam page 
        navigate(`/exam/get/${examId}`);
      } else {
        throw new Error(response.message || 'Failed to start exam');
      }
    } catch (err) {
      toast.error('Failed to start exam. Please try again.');
      console.error('Error starting exam:', err);
    } finally {
      setIsStarting(false);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Exam Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              {examDetails?.title || 'Exam'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {examDetails?.description && (
              <p className="text-muted-foreground">{examDetails.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  Duration: {examDetails?.duration || 60} minutes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  Questions: {examDetails?.totalQuestions || examDetails?.questions?.length || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary">
                  {examDetails?.difficulty || examDetails?.classLevel || 'Standard'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">1.</span>
                <span>Read each question carefully before selecting your answer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">2.</span>
                <span>You can navigate between questions using the Previous/Next buttons.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">3.</span>
                <span>Your progress is automatically saved as you answer questions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">4.</span>
                <span>Make sure to submit your exam before the time expires.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-semibold">5.</span>
                <span>Once submitted, you cannot modify your answers.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Warning */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Once you start the exam, the timer will begin and cannot be paused. 
            Make sure you have a stable internet connection and enough time to complete the exam.
          </AlertDescription>
        </Alert>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleStartExam}
            disabled={isStarting}
            className="px-8"
          >
            {isStarting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Starting Exam...
              </>
            ) : (
              'Start Exam'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}