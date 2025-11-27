
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

// 10 DIVERSE CANDIDATE APPLICATIONS
export const MOCK_APPLICATIONS: Application[] = [
  // 1. High Potential Frontend - Interview Stage
  {
    id: 'app-1',
    jobId: '1', // Senior FE
    applicantId: 'user-1', // Default user Andi
    applicantName: 'Andi Pratama',
    applicantEmail: 'kandidat@demo.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    age: 24,
    location: 'Jakarta Selatan',
    phoneNumber: '+62 812-3456-7890',
    lastEducation: 'S1 Teknik Informatika, Univ Teknologi Digital',
    experience: 'Junior Frontend Developer (2 Tahun)',
    appliedAt: '2 jam yang lalu',
    status: 'interview',
    aiMatchScore: 92,
    aiSummary: 'Kandidat sangat kuat di React dan TypeScript. Pengalaman 2 tahun sangat relevan. Tes coding awal menunjukkan pemahaman mendalam tentang Hooks dan State Management.',
    invitationSent: false,
    internalNotes: [
      { id: 'note-1', author: 'System', text: 'Lolos screening CV otomatis.', createdAt: '2j lalu' },
      { id: 'note-2', author: 'HR Manager', text: 'Ekspektasi gaji masuk budget. Jadwalkan interview user segera.', createdAt: '1j lalu' }
    ]
  },
  // 2. Mid Level - Reviewed Stage
  {
    id: 'app-2',
    jobId: '1',
    applicantId: 'user-102',
    applicantName: 'Budi Santoso',
    applicantEmail: 'budi@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    age: 28,
    location: 'Depok, Jawa Barat',
    phoneNumber: '+62 856-7890-1234',
    lastEducation: 'S1 Sistem Informasi, Gunadarma',
    experience: 'Frontend Developer di Agate (3 Tahun)',
    appliedAt: 'Hari ini',
    status: 'reviewed',
    aiMatchScore: 85,
    aiSummary: 'Skill teknis memadai. Pengalaman di game dev mungkin membawa perspektif unik untuk UI interaktif. Perlu dicek pemahaman tentang SSR (Server Side Rendering).',
    internalNotes: [
        { id: 'note-3', author: 'HR Staff', text: 'Portofolio menarik, banyak animasi.', createdAt: '4j lalu' }
    ]
  },
  // 3. Senior/Mismatched - Rejected Stage
  {
    id: 'app-3',
    jobId: '1',
    applicantId: 'user-103',
    applicantName: 'Chandra Wijaya',
    applicantEmail: 'chandra@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chandra',
    age: 35,
    location: 'Surabaya',
    phoneNumber: '+62 811-2233-4455',
    lastEducation: 'S2 Manajemen, UNAIR',
    experience: 'IT Manager (8 Tahun)',
    appliedAt: 'Kemarin',
    status: 'rejected',
    aiMatchScore: 45,
    aiSummary: 'Overqualified untuk posisi teknis hands-on. Lebih cocok untuk role manajerial. Gaji kemungkinan di atas budget.',
    internalNotes: [
        { id: 'note-4', author: 'System', text: 'Auto-reject based on salary expectation match.', createdAt: 'Kemarin' }
    ]
  },
  // 4. Marketing Star - Hired Stage
  {
    id: 'app-4',
    jobId: '2', // Digital Marketing
    applicantId: 'user-104',
    applicantName: 'Diana Putri',
    applicantEmail: 'diana@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    age: 26,
    location: 'Bandung',
    phoneNumber: '+62 813-9988-7766',
    lastEducation: 'S1 Komunikasi, UNPAD',
    experience: 'Social Media Specialist (4 Tahun)',
    appliedAt: '3 hari yang lalu',
    status: 'hired',
    aiMatchScore: 98,
    aiSummary: 'Kandidat sempurna. Sertifikasi Google Ads & Meta Ads lengkap. Track record ROI tinggi di portfolio sebelumnya. Culture fit sangat baik.',
    internalNotes: [
        { id: 'note-5', author: 'HR Manager', text: 'Offering letter sudah ditandatangani. Mulai kerja tanggal 1.', createdAt: 'Hari ini' }
    ]
  },
  // 5. Design Talent - Talent Pool
  {
    id: 'app-5',
    jobId: '3', // UI/UX
    applicantId: 'user-105',
    applicantName: 'Eka Saputra',
    applicantEmail: 'eka@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eka',
    age: 23,
    location: 'Yogyakarta',
    phoneNumber: '+62 812-0000-1111',
    lastEducation: 'D3 Desain Komunikasi Visual, ISI',
    experience: 'Freelance Designer (2 Tahun)',
    appliedAt: '1 minggu lalu',
    status: 'talent-pool',
    aiMatchScore: 88,
    aiSummary: 'Visual design sangat kuat, tapi pengalaman UX research masih kurang. Potensial untuk masa depan jika ada slot Junior Designer.',
    internalNotes: [
        { id: 'note-6', author: 'Lead Designer', text: 'Simpan kontaknya. Style desainnya unik.', createdAt: '2 hari lalu' }
    ]
  },
  // 6. Backend Strong - Pending
  {
    id: 'app-6',
    jobId: '4', // Backend Go
    applicantId: 'user-106',
    applicantName: 'Fajar Nugraha',
    applicantEmail: 'fajar@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fajar',
    age: 29,
    location: 'Jakarta Pusat',
    phoneNumber: '+62 818-777-888',
    lastEducation: 'S1 Teknik Elektro, ITS',
    experience: 'Backend Engineer (Java/Go) (5 Tahun)',
    appliedAt: 'Baru saja',
    status: 'pending',
    aiMatchScore: 95,
    aiSummary: 'Sangat cocok. Pengalaman migrasi Monolith ke Microservices menggunakan Golang adalah nilai plus besar.',
    internalNotes: []
  },
  // 7. Content Writer - Reviewed
  {
    id: 'app-7',
    jobId: '5', // Content Writer
    applicantId: 'user-107',
    applicantName: 'Gita Savitri',
    applicantEmail: 'gita@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gita',
    age: 22,
    location: 'Malang',
    phoneNumber: '+62 857-1234-5678',
    lastEducation: 'S1 Sastra Inggris, UM',
    experience: 'Editor Majalah Kampus',
    appliedAt: '4 jam lalu',
    status: 'reviewed',
    aiMatchScore: 80,
    aiSummary: 'Gaya penulisan bagus dan engaging. Perlu tes SEO writing untuk memastikan teknikalitasnya.',
    internalNotes: [
         { id: 'note-7', author: 'Content Lead', text: 'Jadwalkan tes tulis.', createdAt: '1j lalu' }
    ]
  },
  // 8. Marketing - Interview (Swapers Result)
  {
    id: 'app-8',
    jobId: '2',
    applicantId: 'user-108',
    applicantName: 'Hendra Gunawan',
    applicantEmail: 'hendra@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    age: 27,
    location: 'Bandung',
    phoneNumber: '+62 812-9988-7766',
    lastEducation: 'S1 Bisnis, ITB',
    experience: 'Growth Hacker (3 Tahun)',
    appliedAt: '2 hari lalu',
    status: 'interview',
    aiMatchScore: 90,
    aiSummary: 'Kandidat data-driven. Hasil Swapers Interview menunjukkan kemampuan komunikasi verbal yang sangat baik dan percaya diri.',
    internalNotes: [
        { id: 'note-8', author: 'Swapers AI', text: 'Voice Analysis: High Confidence, Clear Articulation. Technical answers: 8/10.', createdAt: 'Kemarin' }
    ]
  },
  // 9. Frontend - Rejected (Skill Gap)
  {
    id: 'app-9',
    jobId: '1',
    applicantId: 'user-109',
    applicantName: 'Indra Lesmana',
    applicantEmail: 'indra@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Indra',
    age: 25,
    location: 'Bekasi',
    phoneNumber: '+62 813-4455-6677',
    lastEducation: 'S1 TI, Binus',
    experience: 'Web Developer (Wordpress) (2 Tahun)',
    appliedAt: '5 hari lalu',
    status: 'rejected',
    aiMatchScore: 55,
    aiSummary: 'Pengalaman dominan di CMS (Wordpress), kurang exposure di Modern JS Frameworks (React/Vue) yang dibutuhkan.',
    internalNotes: []
  },
  // 10. Backend - Pending
  {
    id: 'app-10',
    jobId: '4',
    applicantId: 'user-110',
    applicantName: 'Joko Anwar',
    applicantEmail: 'joko.a@example.com',
    applicantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko',
    age: 30,
    location: 'Semarang',
    phoneNumber: '+62 811-5566-7788',
    lastEducation: 'S1 Ilmu Komputer, UGM',
    experience: 'System Analyst (4 Tahun)',
    appliedAt: '1 jam lalu',
    status: 'pending',
    aiMatchScore: 82,
    aiSummary: 'Background kuat di analisis sistem dan database design. Skill coding Go perlu divalidasi lewat tes.',
    internalNotes: []
  }
];
