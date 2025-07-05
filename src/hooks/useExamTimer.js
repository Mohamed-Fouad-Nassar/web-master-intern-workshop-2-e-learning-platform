import { useState, useEffect, useRef } from 'react';
import { examApi } from '@/services/ExamAPI';

export function useExamTimer(examId) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Convert API response to total seconds
  const convertToSeconds = (timeData) => {
    if (typeof timeData === 'number') {
      return timeData; // Already in seconds
    }
    
    if (timeData && typeof timeData === 'object') {
      const minutes = timeData.minutes || 0;
      const seconds = timeData.seconds || 0;
      return (minutes * 60) + seconds;
    }
    
    return 0;
  };

  // Fetch remaining time from API with error handling
  const fetchRemainingTime = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setError(null);
      }
      
      const response = await examApi.getRemainingTime(examId);
      
      // Handle the nested response structure
      const timeData = response.data?.remainingTime || response.remainingTime;
      const remaining = convertToSeconds(timeData);
      
      setTimeRemaining(remaining);
      setIsLoading(false);
      retryCountRef.current = 0; // Reset retry count on success
      
      if (remaining <= 0) {
        setIsExpired(true);
        clearTimers();
      }
    } catch (err) {
      console.error('Error fetching remaining time:', err);
      
      retryCountRef.current += 1;
      
      if (retryCountRef.current <= maxRetries) {
        // Retry with exponential backoff
        const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 10000);
        setTimeout(() => fetchRemainingTime(true), retryDelay);
      } else {
        setError('Failed to fetch exam time. Please refresh the page.');
        setIsLoading(false);
      }
    }
  };

  // Clear all timers
  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // Start timer
  useEffect(() => {
    if (!examId) {
      setError('No exam ID provided');
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchRemainingTime();

    // Poll API every 30 seconds
    intervalRef.current = setInterval(() => {
      fetchRemainingTime(true);
    }, 30000);

    // Local countdown every second
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null) return prev;
        
        if (prev <= 1) {
          setIsExpired(true);
          clearTimers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimers();
    };
  }, [examId]);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    if (seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Manual retry function
  const retry = () => {
    retryCountRef.current = 0;
    setError(null);
    setIsLoading(true);
    fetchRemainingTime();
  };

  return {
    timeRemaining,
    isExpired,
    formattedTime: formatTime(timeRemaining),
    isWarning: timeRemaining !== null && timeRemaining <= 300, // 5 minutes warning
    error,
    isLoading,
    retry
  };
}