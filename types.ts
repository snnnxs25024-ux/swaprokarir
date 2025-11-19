
export enum JobType {
  FULL_TIME = 'Penuh Waktu',
  PART_TIME = 'Paruh Waktu',
  CONTRACT = 'Kontrak',
  FREELANCE = 'Freelance',
  REMOTE = 'Remote'
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  salaryRange: string;
  description: string;
  requirements: string[];
  postedAt: string;
  logoUrl: string;
}

export interface AIAnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// RBAC Types
export type UserRole = 'guest' | 'candidate' | 'recruiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string; // Khusus recruiter
}

// Interview Types
export interface InterviewTemplate {
  id: string;
  title: string;
  questions: string[];
  createdAt: string;
}

// ATS Types
export type ApplicationStatus = 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar: string;
  
  // New Fields for Detailed Profile
  age: number;
  location: string;
  phoneNumber: string;
  lastEducation: string;
  experience: string; // Ringkasan pengalaman kerja (misal: "4 Tahun di Bidang Sales")

  appliedAt: string;
  status: ApplicationStatus;
  aiMatchScore: number; // 0 - 100
  aiSummary: string; // Ringkasan instan untuk recruiter
  
  // Interview Logic
  invitationSent?: boolean; // Apakah link interview sudah dikirim?
}
