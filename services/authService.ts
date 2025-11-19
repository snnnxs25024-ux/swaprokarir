
import { User } from "../types";

// Mock Users Database
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Andi Pratama',
    email: 'kandidat@demo.com',
    role: 'candidate',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi'
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
