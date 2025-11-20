
import { Job, JobType, Application, InterviewTemplate } from "../types";

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechNusa Solutions',
    location: 'Jakarta Selatan',
    type: JobType.FULL_TIME,
    salaryRange: 'Rp 25.000.000 - Rp 35.000.000',
    description: 'Kami mencari React Expert untuk memimpin tim frontend kami dalam membangun aplikasi skala besar.',
    requirements: ['React 18+', 'TypeScript', 'Tailwind CSS', 'Pengalaman 5+ Tahun'],
    postedAt: '2 jam yang lalu',
    logoUrl: 'https://picsum.photos/100/100?random=1',
    category: 'IT & Software',
    minExperience: '5+ Tahun',
    ageMin: 25,
    ageMax: 40,
    gender: 'Bebas',
    domicile: 'Jakarta Selatan',
    educationLevel: 'S1',
    major: 'Teknik Informatika',
    minGpa: 3.0,
    workArrangement: 'Hybrid',
    workingHours: 'Normal (9-5)',
    benefits: ['BPJS', 'Laptop Kantor', 'Asuransi Kesehatan Swasta', 'Bonus Tahunan'],
    quota: 1,
    deadline: '2025-12-31'
  },
  {
    id: '2',
    title: 'Digital Marketing Specialist',
    company: 'Creative Indo',
    location: 'Bandung',
    type: JobType.FULL_TIME,
    salaryRange: 'Rp 8.000.000 - Rp 12.000.000',
    description: 'Mengelola campaign ads dan SEO untuk klien internasional.',
    requirements: ['Google Ads', 'SEO/SEM', 'Copywriting', 'Analisa Data'],
    postedAt: '1 hari yang lalu',
    logoUrl: 'https://picsum.photos/100/100?random=2',
    category: 'Marketing',
    minExperience: '2 Tahun',
    ageMin: 22,
    ageMax: 30,
    gender: 'Bebas',
    educationLevel: 'S1',
    major: 'Komunikasi / Marketing',
    workArrangement: 'WFO',
    benefits: ['BPJS', 'Uang Makan', 'Transport'],
    quota: 2,
    deadline: '2025-11-20'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'StartUp Maju',
    location: 'Yogyakarta',
    type: JobType.CONTRACT,
    salaryRange: 'Rp 10.000.000 - Rp 15.000.000',
    description: 'Mendesain antarmuka pengguna yang intuitif dan indah untuk aplikasi mobile.',
    requirements: ['Figma', 'Prototyping', 'User Research', 'Portfolio Kuat'],
    postedAt: '3 hari yang lalu',
    logoUrl: 'https://picsum.photos/100/100?random=3',
    category: 'Design',
    minExperience: '3 Tahun',
    workArrangement: 'Remote',
    educationLevel: 'D3',
    benefits: ['Waktu Fleksibel', 'Project Bonus'],
    quota: 1
  },
  {
    id: '4',
    title: 'Backend Developer (Go)',
    company: 'Fintech Asia',
    location: 'Jakarta Pusat',
    type: JobType.FULL_TIME,
    salaryRange: 'Rp 20.000.000 - Rp 30.000.000',
    description: 'Membangun sistem pembayaran mikroservices yang aman dan cepat.',
    requirements: ['Go (Golang)', 'PostgreSQL', 'Docker/Kubernetes', 'gRPC'],
    postedAt: 'Baru saja',
    logoUrl: 'https://picsum.photos/100/100?random=4',
    category: 'IT & Software',
    educationLevel: 'S1',
    workArrangement: 'WFO',
    quota: 3
  },
  {
    id: '5',
    title: 'Content Writer',
    company: 'Media Pustaka',
    location: 'Remote',
    type: JobType.FREELANCE,
    salaryRange: 'Rp 5.000.000 - Rp 8.000.000',
    description: 'Menulis artikel blog yang SEO friendly tentang teknologi.',
    requirements: ['Menulis Kreatif', 'SEO Basic', 'Disiplin Deadline'],
    postedAt: '5 jam yang lalu',
    logoUrl: 'https://picsum.photos/100/100?random=5',
    category: 'Content & Media',
    workArrangement: 'Remote',
    quota: 5
  }
];

export const MOCK_TEMPLATES: InterviewTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Frontend Developer Test (React)',
    createdAt: '01 Okt 2025',
    questions: [
      'Jelaskan perbedaan antara useMemo dan useCallback?',
      'Bagaimana cara Anda mengoptimalkan performa rendering React?',
      'Ceritakan pengalaman tersulit Anda saat debugging aplikasi frontend.'
    ]
  },
  {
    id: 'tpl-2',
    title: 'General HR Screening',
    createdAt: '05 Okt 2025',
    questions: [
      'Apa motivasi terbesar Anda melamar di perusahaan ini?',
      'Sebutkan kelebihan dan kekurangan diri Anda.',
      'Bagaimana Anda menangani konflik dengan rekan kerja?'
    ]
  },
  {
    id: 'tpl-3',
    title: 'Sales & Marketing Case',
    createdAt: '07 Okt 2025',
    questions: [
      'Bagaimana strategi Anda menjual produk ke klien yang skeptis?',
      'Ceritakan pencapaian target penjualan terbesar Anda.'
    ]
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: '1',
    applicantId: 'user-101',
    applicantName: 'Budi Santoso',
    applicantEmail: 'budi@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    age: 28,
    location: 'Jakarta Selatan',
    phoneNumber: '+62 812-3456-7890',
    lastEducation: 'S1 Teknik Informatika, UI',
    experience: 'Senior Frontend Dev di Tokopedia (3 Tahun), Frontend di Traveloka (2 Tahun)',
    appliedAt: '1 jam yang lalu',
    status: 'interview',
    aiMatchScore: 92,
    aiSummary: 'Kandidat sangat kuat di React dan TypeScript. Pengalaman 5 tahun sangat relevan dengan kebutuhan Senior FE. Portofolio GitHub aktif.',
    invitationSent: false
  },
  {
    id: 'app-2',
    jobId: '1',
    applicantId: 'user-102',
    applicantName: 'Siti Aminah',
    applicantEmail: 'siti@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    age: 24,
    location: 'Bandung, Jawa Barat',
    phoneNumber: '+62 856-7890-1234',
    lastEducation: 'S1 Sistem Informasi, ITB',
    experience: 'Frontend Developer di Agate (2 Tahun)',
    appliedAt: '3 jam yang lalu',
    status: 'pending',
    aiMatchScore: 78,
    aiSummary: 'Skill teknis memadai untuk level mid, namun pengalaman leadership belum terlihat kuat. Potensial untuk dikembangkan.'
  },
  {
    id: 'app-3',
    jobId: '1',
    applicantId: 'user-103',
    applicantName: 'Joko Anwar',
    applicantEmail: 'joko@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko',
    age: 32,
    location: 'Surabaya, Jawa Timur',
    phoneNumber: '+62 811-2233-4455',
    lastEducation: 'D3 Manajemen Informatika',
    experience: 'Fullstack PHP Developer (7 Tahun)',
    appliedAt: '5 jam yang lalu',
    status: 'rejected',
    aiMatchScore: 45,
    aiSummary: 'Stack teknologi tidak match (Dominan PHP/Laravel vs Kebutuhan React/Go). Culture fit mungkin baik, tapi gap teknis terlalu besar.'
  },
  {
    id: 'app-4',
    jobId: '2',
    applicantId: 'user-104',
    applicantName: 'Rina Mariani',
    applicantEmail: 'rina@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    age: 26,
    location: 'Tangerang Selatan',
    phoneNumber: '+62 813-9988-7766',
    lastEducation: 'S1 Komunikasi, UPH',
    experience: 'Digital Marketing Lead di Startup (3 Tahun)',
    appliedAt: 'Hari ini',
    status: 'hired',
    aiMatchScore: 98,
    aiSummary: 'Kandidat sempurna. Sertifikasi Google Ads & Meta Ads lengkap. Track record ROI tinggi di portfolio sebelumnya.'
  }
];
