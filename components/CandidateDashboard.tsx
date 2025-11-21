
import React from 'react';
import { User, Application, Job } from '../types';
import { Briefcase, Clock, CheckCircle, XCircle, Video, Sparkles, ArrowRight, Building, BookOpen, Star } from 'lucide-react';

interface CandidateDashboardProps {
  user: User;
  applications: Application[];
  jobs: Job[];
  onStartInterview: (jobId: string) => void;
  onViewJobs: () => void;
  onImproveCV?: () => void; // New prop
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({ user, applications, jobs, onStartInterview, onViewJobs, onImproveCV }) => {
  // Filter applications for current user
  const myApplications = applications.filter(app => app.applicantId === user.id);
  
  // Calculate stats
  const stats = {
    applied: myApplications.length,
    interview: myApplications.filter(a => a.status === 'interview').length,
    rejected: myApplications.filter(a => a.status === 'rejected').length,
    hired: myApplications.filter(a => a.status === 'hired').length
  };

  // Get Job details helper
  const getJobDetails = (jobId: string) => jobs.find(j => j.id === jobId);

  // Recommendation logic (jobs not applied yet)
  const appliedJobIds = myApplications.map(a => a.jobId);
  const recommendedJobs = jobs.filter(j => !appliedJobIds.includes(j.id)).slice(0, 3);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'interview': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Interview Tahap Lanjut</span>;
          case 'hired': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Diterima</span>;
          case 'rejected': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Belum Berhasil</span>;
          case 'reviewed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Dilihat HR</span>;
          default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Menunggu</span>;
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles className="w-48 h-48" />
         </div>
         <div className="relative z-10">
             <h1 className="text-3xl font-bold mb-2">Halo, {user.name}! 👋</h1>
             <p className="text-indigo-100 max-w-2xl">
                 Selamat datang di pusat kendali karir Anda. Pantau lamaran, ikuti tes AI, dan temukan peluang baru di sini.
             </p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <Briefcase className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
                  <p className="text-xs text-gray-500">Lamaran Terkirim</p>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                  <Video className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
                  <p className="text-xs text-gray-500">Panggilan Interview</p>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-full text-green-600">
                  <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
                  <p className="text-xs text-gray-500">Diterima Kerja</p>
              </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-full text-red-600">
                  <XCircle className="w-6 h-6" />
              </div>
              <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                  <p className="text-xs text-gray-500">Belum Lolos</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Applications List */}
          <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Aktivitas Lamaran</h2>
                  <button onClick={onViewJobs} className="text-sm text-indigo-600 font-medium hover:text-indigo-800">Cari Loker Lain &rarr;</button>
              </div>

              {myApplications.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">Belum ada lamaran aktif</h3>
                      <p className="text-gray-500 mb-6">Yuk mulai cari pekerjaan impianmu sekarang!</p>
                      <button onClick={onViewJobs} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Cari Lowongan</button>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {myApplications.map(app => {
                          const job = getJobDetails(app.jobId);
                          if (!job) return null;
                          
                          return (
                              <div key={app.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                      <div className="flex gap-4">
                                          <img src={job.logoUrl} alt={job.company} className="w-12 h-12 rounded-lg border border-gray-100 object-cover" />
                                          <div>
                                              <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                                              <p className="text-gray-500 text-sm flex items-center gap-1">
                                                  <Building className="w-3 h-3" /> {job.company} • {job.location}
                                              </p>
                                              <div className="mt-2 flex items-center gap-2">
                                                  {getStatusBadge(app.status)}
                                                  <span className="text-xs text-gray-400">• Dilamar {app.appliedAt}</span>
                                              </div>
                                          </div>
                                      </div>
                                      
                                      {/* ACTION BUTTONS */}
                                      <div className="w-full sm:w-auto">
                                          {app.status === 'interview' && (
                                              <button 
                                                onClick={() => onStartInterview(job.id)}
                                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg shadow-red-200 animate-pulse"
                                              >
                                                  <Video className="w-4 h-4" />
                                                  Mulai Interview AI
                                              </button>
                                          )}
                                          {app.status === 'pending' && (
                                              <div className="px-4 py-2 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium text-center">
                                                  Menunggu Review
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* CV Health Widget */}
              <div className="bg-white rounded-xl p-6 border border-indigo-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      Kekuatan Profil
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * 0.90)} className="text-green-500" />
                          </svg>
                          <span className="absolute text-sm font-bold text-green-700">90%</span>
                      </div>
                      <div>
                          <p className="text-sm font-medium text-gray-900">Sangat Baik!</p>
                          <p className="text-xs text-gray-500">Profil Anda sudah lengkap dan siap melamar.</p>
                      </div>
                  </div>
                  <button 
                    onClick={onImproveCV}
                    className="w-full py-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-medium transition"
                  >
                      Perbarui Profil
                  </button>
              </div>
              
              {/* Learning Path Widget */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Rekomendasi Belajar
                  </h3>
                  <div className="space-y-4">
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                          <p className="text-sm text-purple-800">
                              <span className="font-bold">AI menyarankan:</span> Tingkatkan skill <span className="font-bold">UI/UX Design</span> untuk memperluas peluang karir Anda sebagai Frontend Developer.
                          </p>
                          <a href="#" className="text-xs text-purple-600 hover:underline font-medium mt-2 inline-block">Lihat kursus &rarr;</a>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-700 pt-2">Lencana Skill Anda:</h4>
                      <div className="flex flex-wrap gap-2">
                          {user.skills?.map(skill => (
                              <div key={skill.id} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${skill.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                  <Star className={`w-3 h-3 ${skill.verified ? 'text-green-500' : 'text-gray-400'}`} />
                                  {skill.name} <span className="text-gray-400">({skill.level})</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;