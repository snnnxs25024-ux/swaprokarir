
import React, { useState, useEffect } from 'react';
import { User, Application, Job, SavedJob, JobAlert } from '../types';
import { Briefcase, Video, Sparkles, BookOpen, Zap, Bell, Bookmark, Download } from 'lucide-react';
import { getSavedJobs, createJobAlert, getJobAlerts, deleteJobAlert } from '../services/jobService';
import JobCard from './JobCard';
import ApplicationTimeline from './ApplicationTimeline';
import { generateATPdf } from '../services/pdfService';

interface CandidateDashboardProps {
  user: User;
  applications: Application[];
  jobs: Job[];
  onStartInterview: (jobId: string) => void;
  onViewJobs: () => void;
  onImproveCV?: () => void;
  onVerifySkill: (skillId: string) => void; 
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ user, applications, jobs, onStartInterview, onViewJobs, onImproveCV, onVerifySkill }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'alerts'>('overview');
  
  // New State
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([]);
  const [newAlertKeyword, setNewAlertKeyword] = useState('');
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState<Application | null>(null);

  // Filter applications for current user
  const myApplications = applications.filter(app => app.applicantId === user.id);
  
  // Stats
  const stats = {
    applied: myApplications.length,
    interview: myApplications.filter(a => a.status === 'interview').length,
    rejected: myApplications.filter(a => a.status === 'rejected').length,
    hired: myApplications.filter(a => a.status === 'hired').length
  };

  useEffect(() => {
      if (activeTab === 'saved') {
          getSavedJobs(user.id).then(setSavedJobs);
      } else if (activeTab === 'alerts') {
          getJobAlerts(user.id).then(setJobAlerts);
      }
  }, [activeTab, user.id]);

  // SMART FEED LOGIC
  const userSkillNames = user.skills?.map(s => s.name.toLowerCase()) || [];
  const appliedJobIds = myApplications.map(a => a.jobId);
  const smartRecommendedJobs = jobs.filter(job => {
      if (appliedJobIds.includes(job.id)) return false; 
      return job.requirements.some(req => 
          userSkillNames.some(skill => req.toLowerCase().includes(skill))
      );
  }).slice(0, 3);

  const skillToImprove = user.skills?.find(s => s.level !== 'Advanced');

  const handleCreateAlert = async () => {
      if (!newAlertKeyword.trim()) return;
      try {
          await createJobAlert(user.id, { keywords: newAlertKeyword, location: user.location || '' });
          setNewAlertKeyword('');
          getJobAlerts(user.id).then(setJobAlerts);
          alert("Job Alert berhasil dibuat!");
      } catch (e) {
          console.error(e);
      }
  };
  
  const handleDeleteAlert = async (id: string) => {
      await deleteJobAlert(id);
      setJobAlerts(prev => prev.filter(a => a.id !== id));
  }

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'interview': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Interview</span>;
          case 'hired': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Diterima</span>;
          case 'rejected': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>;
          default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Diproses</span>;
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section with PDF Download */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles className="w-48 h-48" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
             <div>
                 <h1 className="text-3xl font-bold mb-2">Halo, {user.name}! 👋</h1>
                 <p className="text-indigo-100 max-w-2xl">
                     Ada <strong>{smartRecommendedJobs.length} lowongan baru</strong> yang cocok dengan skill Anda hari ini.
                 </p>
             </div>
             <div className="flex gap-3">
                <button onClick={() => generateATPdf(user)} className="px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download CV
                </button>
                <button onClick={onViewJobs} className="px-5 py-2.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition font-bold shadow-lg">
                    Cari Kerja
                </button>
             </div>
         </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 text-sm font-medium border-b-2 transition ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Overview</button>
          <button onClick={() => setActiveTab('saved')} className={`px-6 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${activeTab === 'saved' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <Bookmark className="w-4 h-4" /> Disimpan
          </button>
          <button onClick={() => setActiveTab('alerts')} className={`px-6 py-3 text-sm font-medium border-b-2 transition flex items-center gap-2 ${activeTab === 'alerts' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
             <Bell className="w-4 h-4" /> Job Alerts
          </button>
      </div>

      {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* ... (Stats UI from previous code) ... */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
                        <p className="text-xs text-gray-500">Lamaran</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-indigo-200 transition">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Video className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
                        <p className="text-xs text-gray-500">Interview</p>
                    </div>
                </div>
                {/* ... more stats ... */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Applications List with Timeline Trigger */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat Lamaran</h2>
                        {myApplications.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 border-dashed">
                                <p className="text-gray-500">Belum ada lamaran aktif.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myApplications.map(app => {
                                    const job = jobs.find(j => j.id === app.jobId) || {id: '0', title: 'Unknown', company: 'Unknown', location: '-', logoUrl: ''};
                                    // Extend app object for display
                                    const displayApp = { ...app, jobTitle: job.title, companyName: job.company };

                                    return (
                                        <div key={app.id} onClick={() => setSelectedAppForTimeline(displayApp)} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">{job.company[0]}</div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-600">{job.title}</h3>
                                                        <p className="text-sm text-gray-500">{job.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(app.status)}
                                                    <p className="text-xs text-gray-400 mt-1">Klik untuk detail</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {/* Smart Feed */}
                    {smartRecommendedJobs.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Rekomendasi Untukmu
                            </h2>
                            <div className="grid gap-4">
                                {smartRecommendedJobs.map(job => (
                                    <JobCard 
                                        key={job.id} 
                                        job={job} 
                                        onApply={(jobData) => onStartInterview(jobData.id)} 
                                        user={user} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                     {/* Learning Widget */}
                     <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600"/> Skill Development</h3>
                        {skillToImprove && (
                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                <p className="text-sm text-indigo-800 mb-2">Tingkatkan skill <strong>{skillToImprove.name}</strong> Anda.</p>
                                <div className="w-full bg-white rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: '45%'}}></div>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
            </div>
          </>
      )}

      {activeTab === 'saved' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.length === 0 ? (
                  <div className="col-span-3 text-center py-12 text-gray-500">Belum ada lowongan yang disimpan.</div>
              ) : (
                  savedJobs.map(saved => (
                      <JobCard 
                        key={saved.id} 
                        job={saved.job} 
                        onApply={(jobData) => onStartInterview(jobData.id)} 
                        user={user} 
                      />
                  ))
              )}
          </div>
      )}

      {activeTab === 'alerts' && (
          <div className="max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                  <h3 className="font-bold text-lg mb-4">Buat Notifikasi Baru</h3>
                  <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={newAlertKeyword}
                        onChange={e => setNewAlertKeyword(e.target.value)}
                        placeholder="Kata kunci (misal: Frontend, Jakarta)" 
                        className="flex-1 rounded-lg border-gray-300 border p-2"
                      />
                      <button onClick={handleCreateAlert} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Buat Alert</button>
                  </div>
              </div>
              
              <div className="space-y-3">
                  {jobAlerts.map(alert => (
                      <div key={alert.id} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                          <div>
                              <p className="font-bold text-gray-800">"{alert.keywords}"</p>
                              <p className="text-sm text-gray-500">Di {alert.location || 'Seluruh Indonesia'} • Dibuat {alert.createdAt}</p>
                          </div>
                          <button onClick={() => handleDeleteAlert(alert.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Modals */}
      {selectedAppForTimeline && (
          <ApplicationTimeline 
            application={selectedAppForTimeline} 
            onClose={() => setSelectedAppForTimeline(null)} 
          />
      )}

    </div>
  );
};

export default CandidateDashboard;
