
import { User } from "../types";

// Mock Users Database
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Andi Pratama',
    email: 'kandidat@demo.com',
    role: 'candidate',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    // Detailed candidate profile
    phoneNumber: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    summary: 'Frontend Developer antusias dengan pengalaman 2 tahun dalam membangun UI yang responsif dan modern menggunakan React dan TypeScript.',
    education: [
      { id: 'edu-1', institution: 'Universitas Teknologi Digital', degree: 'S1', major: 'Teknik Informatika', startDate: '2018', endDate: '2022' }
    ],
    experience: [
      { id: 'exp-1', company: 'PT. Cipta Solusi', position: 'Junior Frontend Developer', startDate: '2022', endDate: 'Sekarang', description: '- Mengembangkan dan memelihara komponen UI.\n- Berkolaborasi dengan tim backend.' }
    ],
    skills: [
      { id: 'skill-1', name: 'React', level: 'Advanced', verified: true },
      { id: 'skill-2', name: 'TypeScript', level: 'Intermediate', verified: true },
      { id: 'skill-3', name: 'UI/UX Design', level: 'Beginner', verified: false },
    ]
  },
  {
    id: 'user-2',
    name: 'HR Manager Tech',
    email: 'rekruter@demo.com',
    role: 'recruiter',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HR',
    companyName: 'TechNusa Solutions'
  }
];

export const login = async (email: string): Promise<User> => {
  // Simulasi delay network
  await new Promise(resolve => setTimeout(resolve, 800));

  const user = MOCK_USERS.find(u => u.email === email);
  if (user) {
    return user;
  }
  throw new Error("Email tidak terdaftar atau password salah.");
};

export const logout = async (): Promise<void> => {
  // Simulasi logout
  await new Promise(resolve => setTimeout(resolve, 500));
};