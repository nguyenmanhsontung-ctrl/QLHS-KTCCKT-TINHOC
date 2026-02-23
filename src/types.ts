export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student'
}

export interface User {
  id: string;
  cccd: string;
  password?: string;
  fullName: string;
  role: UserRole;
  grade: string;
  className: string;
  birthDate?: string;
  studentId?: string;
  gender?: string;
  createdAt: number;
}

export interface Lesson {
  id: string;
  grade: string;
  lessonNumber: number;
  title: string;
  description?: string;
}

export interface Question {
  id: string;
  grade: string;
  lessonNumber: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  purpose: string;
  grade: string;
  lessonNumbers: string; // Comma separated
  duration: number; // minutes
  startTime: number;
  endTime: number;
  questionCount: number;
  totalPoints: number;
  pointsPerQuestion: number;
  testPassword?: string;
  maxAttempts: number;
  randomizeFromPool: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  targetType: 'all' | 'classes' | 'students';
  targetClasses: string; // Comma separated
  targetStudents: string; // Comma separated IDs
  createdAt: number;
}

export interface Answer {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  answers: string; // JSON string of {questionIndex: selectedOption}
  submittedAt: number;
}
