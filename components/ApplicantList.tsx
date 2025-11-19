
import React, { useState, useEffect } from 'react';
import { Job, Application, ApplicationStatus } from '../types';
import { ArrowLeft, Sparkles, MessageSquare, Phone, MapPin, Mail, Calendar, GraduationCap, Briefcase, Download, ExternalLink, User as UserIcon, Video, X } from 'lucide-react';

interface ApplicantListProps {
  job: Job;
  applications: Application[];
  onBack: () => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onStartInterview: (applicantName: string) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ job, applications, onBack, onUpdateStatus, onStartInterview }) => {
  // Sort applications by AI Match Score (High to Low) by default
  const sortedApplications = [...applications].sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  
  // Select the first candidate automatically if exists
  const [selectedAppId, setSelectedAppId] = useState<string | null>(sortedApplications.length > 0 ? sortedApplications[0].id : null);
  
  // Mobile view state
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Get selected application object
  const selectedApp = sortedApplications.find(app => app.id === selectedAppId);

  const handleCandidateClick = (appId: string) => {
    setSelectedAppId(appId);
    setShowMobileDetail(true);
  };

  const handleCloseMobileDetail = () => {
    setShowMobileDetail(false);
  };

  const getStatusColor = (status: ApplicationStatus) => {
      switch(status) {
          case 'hired': return 'bg-green-100 text-green-800 border-green-200';
          case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
          case 'interview': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
          default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
  };

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
      if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {job.title} 
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{applications.length} Pelamar</span>
                </h2>
                <p className="text-gray-500 text-sm">Diurutkan berdasarkan AI Recommendation Ranking</p>
            </div>
          </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
        
        {/* LEFT SIDEBAR: LIST KANDIDAT */}
        <div className={`w-full lg:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50 ${showMobileDetail ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 bg-white z-10 shadow-sm">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Cari nama kandidat..." 
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {sortedApplications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 italic">
                        Belum ada pelamar.
                    </div>
                ) : (
                    sortedApplications.map((app) => (
                        <div 
                            key={app.id}
                            onClick={() => handleCandidateClick(app.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-indigo-50/50 relative group
                                ${selectedAppId === app.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex items-start gap-3">
                                <img src={app.applicantAvatar} alt={app.applicantName} className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-bold truncate ${selectedAppId === app.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                            {app.applicantName}
                                        </h3>
                                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getScoreColor(app.aiMatchScore)}`}>
                                            {app.aiMatchScore}%
                                        </span>
                                    </div>
                                    
                                    {/* Custom Info: Umur & Domisili */}
                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-[80px]">{app.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{app.age} Thn</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{app.appliedAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* RIGHT SIDE: DETAIL PROFILE */}
        <div className={`flex-1 flex-col bg-white overflow-hidden ${showMobileDetail ? 'flex' : 'hidden lg:flex'}`}>
            {selectedApp ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Mobile Back Button Header */}
                    <div className="lg:hidden p-4 border-b border-gray-100 flex items-center text-gray-600 bg-gray-50" onClick={handleCloseMobileDetail}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Kembali ke Daftar</span>
                    </div>

                    {/* Profile Header */}
                    <div className="p-6 sm:p-8 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                                <img src={selectedApp.applicantAvatar} alt={selectedApp.applicantName} className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-md" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{selectedApp.applicantName}</h1>
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mt-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase className="w-4 h-4 text-gray-400" />
                                            <span>{job.title}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span>{selectedApp.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{selectedApp.age} Tahun</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                                         <div className="flex items-center gap-1.5">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span>{selectedApp.applicantEmail}</span>
                                        </div>
                                         <div className="flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{selectedApp.phoneNumber}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-center min-w-[120px]">
                                    <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">AI Match</div>
                                    <div className="text-3xl font-bold text-indigo-700">{selectedApp.aiMatchScore}%</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                             <button 
                                onClick={() => onStartInterview(selectedApp.applicantName)}
                                className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center gap-2"
                             >
                                <Video className="w-4 h-4" /> <span className="whitespace-nowrap">Live Interview</span>
                             </button>
                             <button className="w-full sm:flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> Download CV
                             </button>
                             <select 
                                value={selectedApp.status}
                                onChange={(e) => onUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)}
                                className={`w-full sm:flex-1 text-sm font-medium rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 capitalize border bg-gray-50 ${getStatusColor(selectedApp.status)}`}
                            >
                                <option value="pending">Status: Pending</option>
                                <option value="reviewed">Status: Reviewed</option>
                                <option value="interview">Status: Interview</option>
                                <option value="hired">Status: Hired</option>
                                <option value="rejected">Status: Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 bg-gray-50 min-h-full">
                        <div className="grid grid-cols-1 gap-6">
                            {/* AI Executive Summary */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="w-24 h-24 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    AI Executive Summary
                                </h3>
                                <p className="text-gray-700 leading-relaxed relative z-10">
                                    {selectedApp.aiSummary}
                                </p>
                            </div>

                            {/* Experience & Education */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Kualifikasi & Latar Belakang</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pengalaman Kerja</h4>
                                            <p className="text-gray-700 mt-1">{selectedApp.experience}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <GraduationCap className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Pendidikan Terakhir</h4>
                                            <p className="text-gray-700 mt-1">{selectedApp.lastEducation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Attachments */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Lampiran Dokumen</h3>
                                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold text-red-600">PDF</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">CV_{selectedApp.applicantName.replace(' ', '_')}.pdf</p>
                                            <p className="text-xs text-gray-500">2.4 MB • Diupload {selectedApp.appliedAt}</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <UserIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p>Pilih kandidat dari daftar sebelah kiri untuk melihat detail lengkap.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ApplicantList;
