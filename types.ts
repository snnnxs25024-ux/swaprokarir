
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
  category?: string; 
  minExperience?: string; 
  
  // Demographics & Filtering
  ageMin?: number;
  ageMax?: number;
  gender?: 'Laki-laki' | 'Perempuan' | 'Bebas';
  domicile?: string; 
  educationLevel?: 'SMA/SMK' | 'D3' | 'S1' | 'S2' | 'Lainnya';
  major?: string; 
  minGpa?: number;
  workArrangement?: 'WFO' | 'WFH' | 'Hybrid' | 'Remote';
  workingHours?: 'Normal (9-5)' | 'Shift';
  benefits?: string[];
  quota?: number;
  deadline?: string;

  // Helper for UI
  isSaved?: boolean;
}

export interface SavedJob {
    id: string;
    jobId: string;
    job: Job;
    createdAt: string;
}

export interface JobAlert {
    id: string;
    keywords?: string;
    location?: string;
    createdAt: string;
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

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

// RBAC Types
export type UserRole = 'guest' | 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string; // Khusus recruiter

  // Candidate Profile Data
  age?: number;
  phoneNumber?: string;
  location?: string; // Kota Domisili Singkat
  summary?: string;
  
  // New Personal Data
  birthPlace?: string;
  birthDate?: string; // YYYY-MM-DD
  religion?: string;
  address?: string; // Alamat Lengkap

  socialLinks?: SocialLinks;
  education?: Education[];
  experience?: WorkExperience[];
  skills?: SkillBadge[];
  
  // Metadata
  created_at?: string;
}


// Interview Types
export interface InterviewTemplate {
  id: string;
  title: string;
  questions: string[];
  createdAt: string;
}

// --- NEW: Interview Result Structure ---
export interface QnA {
  question: string;
  answer: string;
  aiFeedback?: string;
}

export interface InterviewSession {
  completedAt: string;
  overallScore: number;
  sentiment: 'Positif' | 'Netral' | 'Negatif' | 'Gugup' | 'Percaya Diri';
  summary: string;
  transcript: QnA[];
}

// Collaboration Type
export interface Note {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

// ATS Types
export type ApplicationStatus = 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired' | 'talent-pool';

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
  internalNotes?: Note[]; 
  interviewSession?: InterviewSession; 
  
  // For Timeline
  jobTitle?: string;
  companyName?: string;
  interviewDate?: string; // Mock date for calendar integration
}

// Message Type
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}