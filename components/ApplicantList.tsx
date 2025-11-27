
import React, { useState, useEffect } from 'react';
import { Job, Application, ApplicationStatus, Note } from '../types';
import { ArrowLeft, Sparkles, Phone, MapPin, Mail, Calendar, GraduationCap, Briefcase, Download, ExternalLink, User as UserIcon, Video, MessageSquare, Send, Check, Trash2, Archive, Brain, UserPlus, Filter } from 'lucide-react';

interface ApplicantListProps {
  job: Job;
  applications: Application[];
  recruiterName: string;
  onBack: () => void;
  onUpdateStatus: (appId: string, status: ApplicationStatus) => void;
  onStartInterview: (applicantName: string) => void;
  onAddNewNote: (appId: string, noteText: string) => void;
  onBulkUpdateStatus: (appIds: string[], status: ApplicationStatus) => void; 
}

const ApplicantList: React.FC<ApplicantListProps> = ({ job, applications, recruiterName, onBack, onUpdateStatus, onStartInterview, onAddNewNote, onBulkUpdateStatus }) => {
  const sortedApplications = [...applications].sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(sortedApplications.length > 0 ? sortedApplications[0].id : null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'interview' | 'notes'>('overview');

  // VIEW MODE: Applicants List vs AI Recommendations
  const [viewMode, setViewMode] = useState<'applicants' | 'recommendations'>('applicants');

  // State for Bulk Actions
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  const selectedApp = sortedApplications.find(app => app.id === selectedAppId);

  useEffect(() => {
    // Reset selections when job changes
    setSelectedAppIds([]);
    // Reset view to applicants
    setViewMode('applicants');
  }, [job]);

  useEffect(() => {
     // Update selected app if the list changes and current selected is not in list
     if (sortedApplications.length > 0 && (!selectedAppId || !sortedApplications.find(a => a.id === selectedAppId))) {
         setSelectedAppId(sortedApplications[0].id);
     }
  }, [applications]);

  const handleCandidateClick = (appId: string) => {
    setSelectedAppId(appId);
    setShowMobileDetail(true);
    setActiveTab('overview'); // Reset tab
  };
  
  const handleAddNewNoteInternal = () => {
    if (newNote.trim() && selectedAppId) {
      onAddNewNote(selectedAppId, newNote);
      setNewNote('');
    }
  };

  const handleSelectApplicant = (appId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedAppIds(prev => [...prev, appId]);
    } else {
      setSelectedAppIds(prev => prev.filter(id => id !== appId));
    }
  };
  
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedAppIds(sortedApplications.map(app => app.id));
    } else {
      setSelectedAppIds([]);
    }
  };

  const handleBulkAction = (status: ApplicationStatus) => {
    if (selectedAppIds.length > 0) {
      onBulkUpdateStatus(selectedAppIds, status);
      setSelectedAppIds([]); 
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
      switch(status) {
          case 'hired': return 'bg-green-100 text-green-800 border-green-200';
          case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
          case 'interview': return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'talent-pool': return 'bg-gray-100 text-gray-800 border-gray-200';
          default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
  };

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
      if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
      if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      return 'text-red-600 bg-red-50 border-red-200';
  };

  // Mock Recommendations for Demo
  const recommendations = [
      {
          id: 'rec-1',
          name: 'Citra Kirana',
          headline: 'Senior UX Researcher at Tokopedia',
          match: 96,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra',
          location: 'Jakarta Selatan',
          skills: ['User Research', 'Figma', 'Usability Testing'],
          reason: 'Background psikologi yang kuat dan pengalaman e-commerce yang relevan dengan job description.'
      },
      {
          id: 'rec-2',
          name: 'Dian Sastro',
          headline: 'Product Designer at Gojek',
          match: 92,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian',
          location: 'Jakarta Pusat',
          skills: ['UI Design', 'Design System', 'Prototyping'],
          reason: 'Portofolio visual sangat kuat, cocok untuk kebutuhan rebranding produk.'
      },
       {
          id: 'rec-3',
          name: 'Reza Rahadian',
          headline: 'Frontend Engineer (React Native)',
          match: 88,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reza',
          location: 'Remote (Bali)',
          skills: ['React Native', 'Redux', 'TypeScript'],
          reason: 'Skill teknis match 100%, namun lokasi remote perlu dikonfirmasi.'
      }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {job.title} 
                </h2>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{job.type}</span>
                    • {job.location}
                </p>
            </div>
          </div>

          {/* VIEW MODE TABS */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-stretch md:self-auto">
              <button 
                onClick={() => setViewMode('applicants')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'applicants' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <UserIcon className="w-4 h-4" />
                  Pelamar Masuk
                  <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">{applications.length}</span>
              </button>
              <button 
                onClick={() => setViewMode('recommendations')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${viewMode === 'recommendations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <Sparkles className="w-4 h-4" />
                  Rekomendasi AI
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-xs">{recommendations.length}</span>
              </button>
          </div>
      </div>
      
      {/* CONTENT AREA */}
      {viewMode === 'applicants' ? (
        <>
            {/* Bulk Actions Bar */}
            {selectedAppIds.length > 0 && (
                <div className="mb-4 bg-indigo-50 p-3 rounded-lg flex items-center justify-between shadow-sm animate-fade-in flex-shrink-0">
                <span className="text-sm font-bold text-indigo-700">{selectedAppIds.length} kandidat terpilih</span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 hidden sm:inline">Ubah status ke:</span>
                    <select 
                    onChange={(e) => handleBulkAction(e.target.value as ApplicationStatus)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1"
                    defaultValue=""
                    >
                    <option value="" disabled>Pilih Aksi...</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="interview">Interview</option>
                    <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={() => handleBulkAction('talent-pool')} className="p-2 text-purple-600 bg-purple-100 hover:bg-purple-200 rounded-md transition" title="Simpan ke Talent Pool">
                        <Archive className="w-4 h-4"/>
                    </button>
                </div>
                </div>
            )}

            <div className="flex-1 flex bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
                {/* LEFT LIST */}
                <div className={`w-full lg:w-1/3 border-r border-gray-200 flex flex-col bg-gray-50 ${showMobileDetail ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-200 bg-white z-10 shadow-sm flex items-center gap-4">
                        <input 
                            type="checkbox" 
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedAppIds.length === sortedApplications.length && sortedApplications.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <div className="relative flex-1">
                             <input type="text" placeholder="Cari kandidat..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                             <div className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                                 <Filter className="w-4 h-4" />
                             </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {sortedApplications.length === 0 ? (
                             <div className="p-8 text-center text-gray-500">
                                 <p className="text-sm">Belum ada pelamar untuk posisi ini.</p>
                             </div>
                        ) : (
                            sortedApplications.map((app) => (
                                <div key={app.id} className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-indigo-50/50 relative group flex items-start gap-3 ${selectedAppId === app.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}>
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                                        checked={selectedAppIds.includes(app.id)}
                                        onChange={(e) => handleSelectApplicant(app.id, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()} 
                                    />
                                    <div className="flex-1" onClick={() => handleCandidateClick(app.id)}>
                                    <div className="flex items-start gap-3">
                                        <img src={app.applicantAvatar} alt={app.applicantName} className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`text-sm font-bold truncate ${selectedAppId === app.id ? 'text-indigo-700' : 'text-gray-900'}`}>{app.applicantName}</h3>
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${getScoreColor(app.aiMatchScore)}`}>{app.aiMatchScore}%</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                                <span className="truncate max-w-[150px]">{app.location}</span> • <span>{app.age} Thn</span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getStatusColor(app.status)}`}>{app.status.replace('-', ' ')}</span>
                                                <span className="text-[10px] text-gray-400">{app.appliedAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT DETAIL */}
                <div className={`flex-1 flex-col bg-white overflow-hidden ${showMobileDetail ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedApp ? (
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="lg:hidden p-4 border-b border-gray-100 flex items-center text-gray-600 bg-gray-50" onClick={() => setShowMobileDetail(false)}>
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                <span className="text-sm font-medium">Kembali ke Daftar</span>
                            </div>

                            {/* Candidate Header */}
                            <div className="p-6 sm:p-8 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <img src={selectedApp.applicantAvatar} alt={selectedApp.applicantName} className="w-20 h-20 rounded-full border-2 border-indigo-100" />
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{selectedApp.applicantName}</h1>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span>{selectedApp.location}</span> • <span>{selectedApp.age} Thn</span>
                                            </div>
                                        </div>
                                    </div>
                                    <select value={selectedApp.status} onChange={(e) => onUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)} className={`text-sm font-medium rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 capitalize border ${getStatusColor(selectedApp.status)}`}>
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="interview">Interview</option>
                                        <option value="hired">Hired</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="talent-pool">Talent Pool</option>
                                    </select>
                                </div>
                                
                                {/* TAB NAVIGATION */}
                                <div className="flex gap-6 mt-8 border-b border-gray-200">
                                    <button 
                                        onClick={() => setActiveTab('overview')}
                                        className={`pb-3 text-sm font-medium transition ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Ringkasan
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('interview')}
                                        className={`pb-3 text-sm font-medium transition flex items-center gap-2 ${activeTab === 'interview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        <Brain className="w-4 h-4" />
                                        Hasil AI Interview
                                        {selectedApp.interviewSession && <span className="bg-red-500 w-2 h-2 rounded-full"></span>}
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('notes')}
                                        className={`pb-3 text-sm font-medium transition ${activeTab === 'notes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Catatan
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 bg-gray-50 min-h-full">
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 gap-6 animate-fade-in">
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-indigo-600" /> AI Summary ({selectedApp.aiMatchScore}%)</h3>
                                            <p className="text-gray-700 leading-relaxed">{selectedApp.aiSummary}</p>
                                        </div>
                                        
                                        {/* Education & Experience Simple View */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-gray-500"/> Pendidikan</h3>
                                                 <p className="text-sm text-gray-700">{selectedApp.lastEducation}</p>
                                             </div>
                                              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                                 <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-500"/> Pengalaman</h3>
                                                 <p className="text-sm text-gray-700">{selectedApp.experience}</p>
                                             </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download CV</button>
                                            <button className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"><ExternalLink className="w-4 h-4" /> LinkedIn</button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'interview' && (
                                    <div className="animate-fade-in">
                                        {selectedApp.interviewSession ? (
                                            <div className="space-y-6">
                                                {/* Score Card */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                        <span className="text-sm text-gray-500">Skor Komunikasi</span>
                                                        <div className="text-3xl font-bold text-indigo-600 mt-1">{selectedApp.interviewSession.overallScore}/100</div>
                                                    </div>
                                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                                        <span className="text-sm text-gray-500">Sentimen</span>
                                                        <div className="text-xl font-bold text-gray-800 mt-1 flex items-center gap-2">
                                                            {selectedApp.interviewSession.sentiment === 'Positif' ? '😊' : '😐'} 
                                                            {selectedApp.interviewSession.sentiment}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Transcript */}
                                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                                    <div className="p-4 bg-indigo-50 border-b border-indigo-100">
                                                        <h3 className="font-bold text-indigo-900">Transkrip Tanya Jawab</h3>
                                                    </div>
                                                    <div className="divide-y divide-gray-100">
                                                        {selectedApp.interviewSession.transcript.map((item, idx) => (
                                                            <div key={idx} className="p-5">
                                                                <div className="flex gap-3 mb-2">
                                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">Q</div>
                                                                    <p className="text-sm font-semibold text-gray-900">{item.question}</p>
                                                                </div>
                                                                <div className="flex gap-3 mb-3">
                                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">A</div>
                                                                    <p className="text-sm text-gray-600 leading-relaxed">"{item.answer}"</p>
                                                                </div>
                                                                {item.aiFeedback && (
                                                                    <div className="ml-9 bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                                                                        <strong>🤖 AI Note:</strong> {item.aiFeedback}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                                                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <h3 className="text-gray-900 font-medium">Belum Ada Data Interview</h3>
                                                <p className="text-sm text-gray-500 mt-1">Kandidat belum melakukan sesi interview AI atau live.</p>
                                                <button 
                                                    onClick={() => onStartInterview(selectedApp.applicantName)}
                                                    className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                                >
                                                    Undang Interview Sekarang
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div className="animate-fade-in">
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Catatan Internal</h3>
                                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 mb-4">
                                            {selectedApp.internalNotes && selectedApp.internalNotes.length > 0 ? selectedApp.internalNotes.map(note => (
                                                <div key={note.id} className="flex items-start gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">{note.author.substring(0, 2)}</div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{note.author} <span className="text-gray-400 font-normal text-xs ml-2">{note.createdAt}</span></p>
                                                        <p className="text-gray-600">{note.text}</p>
                                                    </div>
                                                </div>
                                            )) : <p className="text-sm text-gray-500 italic">Belum ada catatan.</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Tulis catatan untuk tim..." className="flex-1 text-sm border-gray-300 rounded-lg shadow-sm" />
                                                <button onClick={handleAddNewNoteInternal} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"><Send className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center">
                            <UserIcon className="w-12 h-12 mb-4 text-gray-300" />
                            <p>Pilih kandidat untuk melihat detail.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
      ) : (
        /* --- RECOMMENDATION VIEW --- */
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 animate-fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">AI Talent Scout</h4>
                    <p className="text-blue-800 text-sm mt-1">
                        Sistem kami menemukan <strong>{recommendations.length} kandidat pasif</strong> dari Talent Pool yang memiliki kecocokan tinggi dengan kriteria lowongan ini.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(rec => (
                    <div key={rec.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                    <img src={rec.avatar} alt="" className="w-12 h-12 rounded-full border border-gray-100" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{rec.name}</h3>
                                        <p className="text-xs text-gray-500">{rec.location}</p>
                                    </div>
                            </div>
                            <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                {rec.match}% <span className="hidden sm:inline">Match</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium mb-3 line-clamp-1" title={rec.headline}>{rec.headline}</p>
                        
                        <div className="bg-indigo-50 p-3 rounded-lg mb-4 border border-indigo-100">
                            <p className="text-xs text-indigo-800 leading-relaxed">
                                <Sparkles className="w-3 h-3 inline mr-1 fill-indigo-400" />
                                {rec.reason}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {rec.skills.map(s => (
                                <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                    {s}
                                </span>
                            ))}
                        </div>

                        <button 
                            onClick={() => alert(`Undangan terkirim ke ${rec.name}!`)}
                            className="w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            Undang Melamar
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
