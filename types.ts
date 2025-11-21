
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

  // New Detailed Fields
  category?: string; // IT, HR, Finance
  minExperience?: string; // Fresh Grad, 1 Tahun, dll
  
  // Demographics & Filtering
  ageMin?: number;
  ageMax?: number;
  gender?: 'Laki-laki' | 'Perempuan' | 'Bebas';
  domicile?: string; // Kota wajib domisili

  // Education
  educationLevel?: 'SMA/SMK' | 'D3' | 'S1' | 'S2' | 'Lainnya';
  major?: string; // Jurusan
  minGpa?: number;

  // Work Arrangement
  workArrangement?: 'WFO' | 'WFH' | 'Hybrid' | 'Remote';
  workingHours?: 'Normal (9-5)' | 'Shift';
  
  // Benefits & Admin
  benefits?: string[];
  quota?: number;
  deadline?: string;
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

// CV Builder Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillBadge {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  verified: boolean;
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

  // Candidate Profile Data
  phoneNumber?: string;
  location?: string;
  summary?: string;
  education?: Education[];
  experience?: WorkExperience[];
  skills?: SkillBadge[];
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
  age: number;
  location: string;
  phoneNumber: string;
  lastEducation: string;
  experience: string;
  appliedAt: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  aiSummary: string;
  invitationSent?: boolean;
}