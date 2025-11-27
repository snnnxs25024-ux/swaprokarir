
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import AIResumeReview from './components/AIResumeReview';
import AIChat from './components/AIChat';
import LoginModal from './components/LoginModal';
import PostJob from './components/PostJob';
import RecruiterDashboard from './components/RecruiterDashboard';
import ApplicantList from './components/ApplicantList';
import LiveInterview from './components/LiveInterview';
import InterviewCenter from './components/InterviewCenter';
import SwapersInterview from './components/SwapersInterview';
import CandidateDashboard from './components/CandidateDashboard';
import CandidateProfile from './components/CandidateProfile';
import RecruiterAnalytics from './components/RecruiterAnalytics';
import TalentPool from './components/TalentPool';
import Messages from './components/Messages';
import AdminDashboard from './components/AdminDashboard'; // Import Admin Dashboard
import { MOCK_JOBS, MOCK_APPLICATIONS, MOCK_TEMPLATES } from './services/mockData';
import { getCurrentUser, logout } from './services/authService';
import { Job, User, Application, ApplicationStatus, InterviewTemplate, QnA } from './types';
import { Building, Briefcase, ArrowLeft, CheckCircle2, Lock, LogOut } from 'lucide-react';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Edit Job State
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Interview State
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewOpponent, setInterviewOpponent] = useState('');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Data State
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [interviewTemplates, setInterviewTemplates] = useState<InterviewTemplate[]>(MOCK_TEMPLATES);

  // Initialize Auth Session
  useEffect(() => {
      const initAuth = async () => {
          try {
              const currentUser = await getCurrentUser();
              if (currentUser) {
                  setUser(currentUser);
                  // Redirect ke dashboard yang sesuai jika user ada
                  if (currentUser.role === 'candidate') setCurrentView('candidate-dashboard');
                  else if (currentUser.role === 'recruiter') setCurrentView('recruiter-dashboard');
                  else if (currentUser.role === 'admin') setCurrentView('admin-dashboard'); // Redirect Admin
              }
          } catch (e) {
              console.error("Error checking auth:", e);
          } finally {
              setAuthLoading(false);
          }
      };
      initAuth();
  }, []);

  // Reset scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // RBAC Logic: Intercept View Change
  const handleSetView = (viewId: string) => {
    // Jika Guest mencoba akses fitur AI
    if ((viewId === 'ai-resume' || viewId === 'ai-chat') && !user) {
        setIsLoginModalOpen(true);
        return;
    }
    // Jika Non-Recruiter mencoba akses Recruiter Pages
    if ((viewId === 'post-job' || viewId === 'recruiter-dashboard' || viewId === 'interview-center' || viewId === 'talent-pool') && user?.role !== 'recruiter') {
        // Admin still might want to see these but usually separate view
        if (user?.role !== 'admin') return; 
    }
    // Jika Candidate View
    if ((viewId === 'candidate-dashboard' || viewId === 'profile') && user?.role !== 'candidate') {
        return;
    }
    // Jika Admin Pages
    if ((viewId === 'admin-dashboard' || viewId === 'admin-users' || viewId === 'admin-jobs') && user?.role !== 'admin') {
        return;
    }
    
    // Reset edit state if leaving post job
    if (viewId !== 'post-job') setEditingJob(null);

    setCurrentView(viewId);
  };

  const handleLogout = async () => {
      await logout();
      setUser(null);
      setCurrentView('home');
  };

  // ... (Sisa fungsi handleJobClick, handleStartInterview, dll sama seperti sebelumnya)
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    if (user?.role === 'recruiter') {
        // Recruiter klik job card -> pergi ke list pelamar
        setCurrentView('applicant-list');
    } else {
        setCurrentView('job-detail');
    }
  };

  const handleStartInterview = (candidateName: string) => {
      setInterviewOpponent(candidateName);
      setIsInterviewActive(true);
  };

  const handleApplyClick = () => {
      if (!user) {
          setIsLoginModalOpen(true);
          return;
      }
      if (user.role === 'recruiter' || user.role === 'admin') {
          alert("Akun perusahaan/admin tidak dapat melamar pekerjaan.");
          return;
      }
      
      if (selectedJob) {
          // Check if already applied
          const alreadyApplied = applications.find(a => a.jobId === selectedJob.id && a.applicantId === user.id);
          if (alreadyApplied) {
              alert("Anda sudah melamar pekerjaan ini sebelumnya.");
              return;
          }

          // Simulate creating new application
          const newApp: Application = {
              id: `app-${Date.now()}`,
              jobId: selectedJob.id,
              applicantId: user.id,
              applicantName: user.name,
              applicantEmail: user.email,
              applicantAvatar: user.avatarUrl || '',
              age: user.age || 0,
              location: user.location || '-',
              phoneNumber: user.phoneNumber || '-',
              lastEducation: user.education?.[0]?.degree || '-',
              experience: user.experience?.[0]?.position || 'Fresh Graduate',
              appliedAt: 'Baru saja',
              status: 'pending',
              aiMatchScore: Math.floor(Math.random() * (98 - 60) + 60), // Random score for demo
              aiSummary: 'Kandidat baru. Analisis mendalam sedang diproses oleh AI...'
          };
          
          setApplications([newApp, ...applications]);
          alert("Lamaran berhasil dikirim! Pantau status di Dashboard Anda.");
          setCurrentView('candidate-dashboard');
      }
  };

  const handlePostJob = (newJob: Job) => {
      // Check if updating existing or creating new
      const existingIndex = jobs.findIndex(j => j.id === newJob.id);
      
      if (existingIndex >= 0) {
          // Update
          const updatedJobs = [...jobs];
          updatedJobs[existingIndex] = newJob;
          setJobs(updatedJobs);
      } else {
          // Create
          setJobs([newJob, ...jobs]);
      }
      setEditingJob(null);
      setCurrentView('recruiter-dashboard'); 
  };

  const handleEditJob = (jobToEdit: Job) => {
      setEditingJob(jobToEdit);
      setCurrentView('post-job');
  };

  const handleUpdateApplicationStatus = (appId: string, status: ApplicationStatus) => {
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
  };

  const handleAddTemplate = (template: InterviewTemplate) => {
      setInterviewTemplates([...interviewTemplates, template]);
      alert("Template soal berhasil disimpan ke Bank Soal!");
  };

  const handleSendInterviewInvite = (appId: string, templateId: string) => {
      // Simulate sending email logic
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'interview', invitationSent: true } : a));
      const template = interviewTemplates.find(t => t.id === templateId);
      alert(`Undangan Interview (Email) telah dikirim ke kandidat dengan lampiran soal: ${template?.title}`);
  };
  
  const handleAIInterviewComplete = (results: QnA[]) => {
      // Cari aplikasi milik user yang sedang login yang statusnya 'interview'
      // Untuk demo, kita ambil aplikasi terakhir dari user ini yang statusnya interview atau pending
      if (!user) return;

      setApplications(prev => {
          // Find target application (simplification: logic finds the first relevant app)
          const targetAppIndex = prev.findIndex(app => app.applicantId === user.id && (app.status === 'interview' || app.status === 'pending'));
          
          if (targetAppIndex !== -1) {
              const updatedApps = [...prev];
              updatedApps[targetAppIndex] = {
                  ...updatedApps[targetAppIndex],
                  status: 'interview', // Ensure status is interview
                  interviewSession: {
                      completedAt: 'Baru saja',
                      overallScore: 85, // Mock Score
                      sentiment: 'Percaya Diri', // Mock Sentiment
                      summary: 'Kandidat menjawab dengan lancar dan poin-poin yang jelas.',
                      transcript: results
                  }
              };
              return updatedApps;
          }
          return prev;
      });

      alert("Sesi Swapers selesai! Hasil telah dikirim ke Dashboard Rekruter.");
      if (user?.role === 'candidate') setCurrentView('candidate-dashboard');
      else setCurrentView('home');
  };

  const renderContent = () => {
    if (isInterviewActive) {
        return (
            <LiveInterview 
                user={user} 
                opponentName={interviewOpponent} 
                onEndCall={() => setIsInterviewActive(false)} 
            />
        );
    }

    switch (currentView) {
      case 'home':
        return (
          <>
            <Hero onSearch={() => handleSetView('jobs')} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="flex flex-col sm:flex-row justify-between items-end mb-10 border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Lowongan Terbaru</h2>
                    <p className="text-gray-500 mt-2">Peluang terbaik minggu ini yang dikurasi untuk Anda.</p>
                </div>
                <button 
                    onClick={() => handleSetView('jobs')}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold mt-4 sm:mt-0 flex items-center gap-1"
                >
                    Lihat Semua <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.slice(0, 3).map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleJobClick} user={user} />
                ))}
              </div>

              {/* CTA Section - Hanya muncul jika user bukan Recruiter/Admin */}
              {(!user || user?.role === 'candidate') && (
                <div className="mt-24 bg-indigo-900 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 sm:p-12 flex flex-col justify-center relative z-10">
                        <div className="inline-block w-fit px-3 py-1 rounded-full bg-indigo-800 text-indigo-200 text-sm font-medium mb-6">
                            🚀 Fitur Unggulan
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                        Bingung Arah Karir? <br/>
                        <span className="text-indigo-300">AI Kami Siap Membantu.</span>
                        </h2>
                        <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Dapatkan saran karir yang dipersonalisasi, tips wawancara, dan perbaikan CV instan menggunakan teknologi Google Gemini 2.5 terbaru.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => handleSetView('ai-chat')}
                                className="w-fit bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
                            >
                                Mulai Chat Gratis
                            </button>
                            <button 
                                onClick={() => handleSetView('ai-resume')}
                                className="w-fit bg-transparent border border-indigo-400 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-800 transition"
                            >
                                Cek Resume
                            </button>
                        </div>
                    </div>
                    <div className="relative h-64 lg:h-auto">
                        <div className="absolute inset-0 bg-indigo-900/20 z-10 lg:hidden"></div>
                        <img 
                            src="https://picsum.photos/800/800?random=20" 
                            className="absolute inset-0 w-full h-full object-cover opacity-90" 
                            alt="AI Career" 
                        />
                        {/* Decorative overlay */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-900 to-transparent lg:bg-gradient-to-l"></div>
                    </div>
                    </div>
                </div>
              )}
            </div>
          </>
        );
      // ... (Rest of the cases remain the same, just referencing handleLogout in profile/navbar)
      case 'jobs':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 text-center">
                 <h2 className="text-3xl font-bold text-gray-900">Semua Lowongan</h2>
                 <p className="text-gray-600 mt-2">Temukan pekerjaan yang sesuai dengan keahlian Anda.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={handleJobClick} user={user} />
                ))}
            </div>
          </div>
        );
      case 'ai-resume':
        if (!user || user.role !== 'candidate') return null; 
        return <AIResumeReview />;
      case 'ai-chat':
        if (!user || user.role !== 'candidate') return null;
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Konsultan Karir Virtual</h2>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Diskusikan strategi karir Anda dengan AI. Tanyakan tentang gaji, tips interview, atau pengembangan skill.</p>
                </div>
                <AIChat />
            </div>
        );
      case 'post-job':
          if (user?.role !== 'recruiter') return null;
          return (
            <PostJob 
                onPostJob={handlePostJob} 
                companyName={user.companyName || 'Perusahaan Anda'} 
                initialData={editingJob}
            />
          );
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-jobs':
          if (user?.role !== 'admin') return null;
          return <AdminDashboard />;
      case 'recruiter-dashboard':
          if (user?.role !== 'recruiter') return null;
          return (
            <RecruiterDashboard 
                jobs={jobs} 
                applications={applications} 
                onPostJob={() => {
                    setEditingJob(null);
                    setCurrentView('post-job');
                }}
                onViewApplicants={(jobId) => {
                    const job = jobs.find(j => j.id === jobId);
                    if(job) {
                        setSelectedJob(job);
                        setCurrentView('applicant-list');
                    }
                }}
                onEditJob={handleEditJob}
                onViewAnalytics={() => setCurrentView('recruiter-analytics')}
                onViewTalentPool={() => setCurrentView('talent-pool')}
            />
          );
      case 'recruiter-analytics':
          if (user?.role !== 'recruiter') return null;
          return <RecruiterAnalytics applications={applications} jobs={jobs} onBack={() => setCurrentView('recruiter-dashboard')} />;
      case 'talent-pool':
          if (user?.role !== 'recruiter') return null;
          return (
            <TalentPool 
              applications={applications} 
              jobs={jobs} 
              onBack={() => setCurrentView('recruiter-dashboard')} 
              onViewApplicant={(app) => {
                    const job = jobs.find(j => j.id === app.jobId);
                    if (job) {
                        setSelectedJob(job);
                        setCurrentView('applicant-list'); 
                    }
              }}
            />
          );
      case 'messages':
          if (!user) return null;
          return <Messages user={user} />;
      case 'candidate-dashboard':
          if (user?.role !== 'candidate') return null;
          return (
              <CandidateDashboard 
                user={user}
                applications={applications}
                jobs={jobs}
                onStartInterview={() => setCurrentView('ai-interview-room')}
                onViewJobs={() => setCurrentView('jobs')}
                onImproveCV={() => setCurrentView('ai-resume')}
                onVerifySkill={(skillId) => {
                    if (user) {
                        const updatedUser = { 
                            ...user, 
                            skills: user.skills?.map(s => s.id === skillId ? { ...s, verified: true } : s) 
                        };
                        setUser(updatedUser);
                        alert("Skill Anda berhasil diverifikasi!");
                    }
                }}
              />
          );
      case 'profile':
          if (user?.role !== 'candidate') return null;
          return (
            <CandidateProfile 
                user={user}
                onUpdateUser={(updatedUser) => setUser(updatedUser)}
                onLogout={handleLogout}
            />
          );
      case 'interview-center':
          if (user?.role !== 'recruiter') return null;
          return (
              <InterviewCenter 
                templates={interviewTemplates}
                applications={applications}
                jobs={jobs}
                onAddTemplate={handleAddTemplate}
                onSendInvite={handleSendInterviewInvite}
                onStartLiveSession={handleStartInterview}
              />
          );
      case 'ai-interview-room':
          return (
              <SwapersInterview 
                candidateName={user?.name || 'Kandidat'}
                questions={[
                    "Ceritakan sedikit tentang pengalaman kerja Anda?",
                    "Mengapa Anda tertarik melamar di posisi ini?",
                    "Apa pencapaian terbesar Anda sejauh ini?"
                ]}
                onComplete={handleAIInterviewComplete}
              />
          );
      case 'applicant-list':
          if (user?.role !== 'recruiter' || !selectedJob) return null;
          return (
              <ApplicantList 
                job={selectedJob}
                applications={applications.filter(a => a.jobId === selectedJob.id)}
                recruiterName={user?.name || 'Recruiter'}
                onBack={() => setCurrentView('recruiter-dashboard')}
                onUpdateStatus={handleUpdateApplicationStatus}
                onStartInterview={handleStartInterview}
                onAddNewNote={(appId, noteText) => {
                    setApplications(prev => prev.map(app => {
                        if (app.id === appId) {
                            return {
                                ...app,
                                internalNotes: [...(app.internalNotes || []), {
                                    id: `note-${Date.now()}`,
                                    author: user?.name || 'Recruiter',
                                    text: noteText,
                                    createdAt: 'Baru saja'
                                }]
                            };
                        }
                        return app;
                    }));
                }}
                onBulkUpdateStatus={(appIds, status) => {
                    setApplications(prev => prev.map(app => appIds.includes(app.id) ? { ...app, status } : app));
                }}
              />
          );
      case 'job-detail':
        return selectedJob ? (
            <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <button onClick={() => handleSetView('jobs')} className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Lowongan
                </button>
                
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {/* Header Job */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-indigo-50/50">
                        <div className="flex flex-col md:flex-row md:items-center">
                             <img className="h-20 w-20 rounded-xl object-cover border border-gray-200 shadow-sm mr-6" src={selectedJob.logoUrl} alt={selectedJob.company} />
                             <div className="mt-4 md:mt-0">
                                 <h1 className="text-3xl font-bold text-gray-900">{selectedJob.title}</h1>
                                 <div className="flex items-center text-indigo-700 mt-2 text-lg">
                                    <Building className="w-5 h-5 mr-2" />
                                    <span className="font-medium">{selectedJob.company}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 p-8 border-r border-gray-100">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Pekerjaan</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Persyaratan</h3>
                                <ul className="space-y-3">
                                    {selectedJob.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-gray-50 p-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Ringkasan</h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-gray-500 block text-sm mb-1">Lokasi</span>
                                    <span className="font-semibold text-gray-900">{selectedJob.location}</span>
                                </div>
                                 <div>
                                    <span className="text-gray-500 block text-sm mb-1">Gaji</span>
                                    <span className="font-semibold text-gray-900">{selectedJob.salaryRange}</span>
                                </div>
                                 <div>
                                    <span className="text-gray-500 block text-sm mb-1">Tipe Pekerjaan</span>
                                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">{selectedJob.type}</span>
                                </div>
                                 <div>
                                    <span className="text-gray-500 block text-sm mb-1">Diposting</span>
                                    <span className="font-medium text-gray-900">{selectedJob.postedAt}</span>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col gap-4">
                                 {user?.role === 'recruiter' ? (
                                     <button 
                                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                                        onClick={() => setCurrentView('applicant-list')}
                                     >
                                         Lihat Pelamar
                                     </button>
                                 ) : (
                                    <button 
                                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                                        onClick={handleApplyClick}
                                    >
                                        {user ? 'Lamar Sekarang' : (
                                            <> <Lock className="w-4 h-4"/> Masuk untuk Melamar </>
                                        )}
                                    </button>
                                 )}
                                 
                                 {(!user || user.role === 'candidate') && (
                                    <button 
                                        className="w-full bg-white border-2 border-indigo-600 text-indigo-700 py-3 rounded-xl font-bold hover:bg-indigo-50 transition flex justify-center items-center gap-2"
                                        onClick={() => {
                                            handleSetView('ai-resume');
                                        }}
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        Cek Kecocokan CV
                                    </button>
                                 )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
      default:
        return <Hero onSearch={() => handleSetView('jobs')} />;
    }
  };

  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
      );
  }

  return (
    <div className={`min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 ${user?.role === 'candidate' ? 'pb-24 md:pb-0' : ''}`}>
      {!isInterviewActive && currentView !== 'ai-interview-room' && (
          <Navbar 
            currentView={currentView} 
            setView={handleSetView} 
            user={user}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogoutClick={handleLogout}
          />
      )}
      
      <main>
        {renderContent()}
      </main>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => {
            setUser(u);
            setIsLoginModalOpen(false);
            if (u.role === 'candidate') setCurrentView('candidate-dashboard');
            else if (u.role === 'recruiter') setCurrentView('recruiter-dashboard');
            else if (u.role === 'admin') setCurrentView('admin-dashboard');
        }}
      />

      {!isInterviewActive && currentView !== 'ai-interview-room' && (
          <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                      <div className="col-span-1 md:col-span-1">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <Logo className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">SWAPRO KARIR</span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">
                              Platform pencarian kerja masa depan yang didukung oleh kecerdasan Google Gemini untuk membantu Anda mencapai karir impian dengan lebih cerdas dan cepat.
                          </p>
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Perusahaan</h4>
                          <ul className="space-y-3 text-gray-500 text-sm">
                              <li className="hover:text-indigo-600 cursor-pointer transition">Tentang Kami</li>
                              <li className="hover:text-indigo-600 cursor-pointer transition">Blog Karir</li>
                              <li className="hover:text-indigo-600 cursor-pointer transition">Bekerja di SWAPRO</li>
                              <li className="hover:text-indigo-600 cursor-pointer transition">Hubungi Kami</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Legal & Privasi</h4>
                          <ul className="space-y-3 text-gray-500 text-sm">
                              <li className="hover:text-indigo-600 cursor-pointer transition">Kebijakan Privasi</li>
                              <li className="hover:text-indigo-600 cursor-pointer transition">Syarat & Ketentuan</li>
                              <li className="hover:text-indigo-600 cursor-pointer transition">Cookie Policy</li>
                          </ul>
                      </div>
                  </div>
                  <div className="border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                      <p>&copy; 2024 SWAPRO KARIR. All rights reserved.</p>
                      <div className="flex space-x-6 mt-4 md:mt-0">
                          <span>Twitter</span>
                          <span>LinkedIn</span>
                          <span>Instagram</span>
                      </div>
                  </div>
              </div>
          </footer>
      )}
    </div>
  );
};

export default App;
