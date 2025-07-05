import axios from 'axios';

const BASE_URL = 'https://edu-master-delta.vercel.app';

// Create axios instance with base config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  return config;
});

export const examApi = {
  // Start exam
  startExam: async (examId) => {
    const response = await api.post(`/studentExam/start/${examId}`);
    return response.data;
  },

  // Get remaining time for exam
  getRemainingTime: async (examId) => {
    const response = await api.get(`/studentExam/exams/remaining-time/${examId}`);
    return response.data;
  },

  // Submit exam answers
  submitExam: async (examId, answers) => {
    const response = await api.post(`/studentExam/submit/${examId}`, {
      answers
    });
    return response.data;
  },

  // Get student's exam score (for individual student)
  getStudentExamScore: async (examId) => {
    const response = await api.get(`/studentExam/exams/score/${examId}`);
    return response.data;
  },

  // Get all student scores for exam (admin only)
  getAllExamScores: async (examId, studentName = null) => {
    const params = studentName ? { studentName } : {};
    const response = await api.get(`/studentExam/exams/${examId}`, { params });
    return response.data;
  },

  // Get all available exams for student
  getAllExams: async () => {
    const response = await api.get('/exam');
    return response.data;
  },

  // Get exam details before starting (this endpoint doesn't exist)
  getExamDetails: async (examId) => {
    // Since there's no dedicated exam details endpoint, 
    // we'll use the getAllExams and filter by ID
    try {
      const response = await api.get('/exam');
      const exams = response.data.data || response.data;
      const exam = exams.find(e => e._id === examId);
      return { data: { exam } };
    } catch (error) {
      throw new Error('Exam details not available');
    }
  },

    // Get exam data with questions (for taking the exam)
    getExamData: async (examId) => {
      const response = await api.get(`/exam/get/${examId}`);
      return response.data;
    },
};