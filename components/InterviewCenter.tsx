
import React, { useState } from 'react';
import { InterviewTemplate, Application, Job } from '../types';
import { Video, FileText, Plus, Send, Trash2, Save, Users, CheckCircle, MessageCircle, Bot } from 'lucide-react';

interface InterviewCenterProps {
  templates: InterviewTemplate[];
  applications: Application[]; // All applications, we filter inside
  jobs: Job[];
  onAddTemplate: (template: InterviewTemplate) => void;
  onSendInvite: (appId: string, templateId: string) => void;
  onStartLiveSession: (candidateName: string) => void;
}

const InterviewCenter: React.FC<InterviewCenterProps> = ({ 
  templates, 
  applications, 
  jobs,
  onAddTemplate, 
  onSendInvite,
  onStartLiveSession
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'templates'>('candidates');
  
  // Template Creation State
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newQuestions, setNewQuestions] = useState<string[]>(['']);

  // Invite State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Filter only candidates in 'interview' stage
  const interviewCandidates = applications.filter(app => app.status === 'interview');

  const handleAddQuestion = () => {
    setNewQuestions([...newQuestions, '']);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...newQuestions];
    updated[index] = value;
    setNewQuestions(updated);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateTitle.trim()) return alert("Judul template harus diisi");
    const validQuestions = newQuestions.filter(q => q.trim() !== '');
    if (validQuestions.length === 0) return alert("Minimal satu pertanyaan");

    const newTemplate: InterviewTemplate = {
      id: `tpl-${Date.now()}`,
      title: newTemplateTitle,
      questions: validQuestions,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    onAddTemplate(newTemplate);
    setIsCreatingTemplate(false);
    setNewTemplateTitle('');
    setNewQuestions(['']);
  };

  const getJobTitle = (jobId: string) => {
    return jobs.find(j => j.id === jobId)?.title || 'Unknown Job';
  };

  const getWhatsAppLink = (app: Application) => {
    const phone = app.phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const jobTitle = getJobTitle(app.jobId);
    
    // Simulasi Link Deep Linking (Di production ini adalah link unik dengan token)
    // Karena ini demo SPA, kita gunakan format URL dummy yang terlihat profesional
    const interviewLink = `https://swapro.id/ai-interview-room/${app.id}`;

    const text = `Halo *${app.applicantName}*, selamat!

Profil Anda menarik perhatian kami. Kami mengundang Anda untuk **bergabung (join)** dalam sesi Wawancara Virtual bersama asisten AI kami, *Swapers*, untuk posisi *${jobTitle}*.

📋 **Persiapan Sebelum Join:**
1. Pastikan koneksi internet stabil.
2. **Wajib** menggunakan Laptop/HP dengan **Kamera & Mikrofon aktif**.
3. Cari ruangan yang tenang (tidak berisik).
4. Berpakaian rapi (Video akan direkam).

⏱️ **Estimasi Durasi:** 10-15 Menit.

Silakan klik link di bawah ini untuk memulai sesi:
👉 ${interviewLink}

*Sistem akan memandu Anda secara otomatis setelah link dibuka. Good luck!*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-8 h-8 text-indigo-600" />
            Interview Command Center
          </h1>
          <p className="text-gray-500 mt-1">Kelola sesi wawancara AI dan wawancara langsung dalam satu tempat.</p>
        </div>
        
        {/* DEMO BUTTON FOR AI INTERVIEW ROOM */}
        <button 
            onClick={() => (window as any).location.reload()} 
            className="hidden"
        >
        </button>
        
        <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                alert("Untuk demo, silakan kembali ke Dashboard dan login sebagai Kandidat, atau gunakan tombol 'Preview AI' di bawah.");
            }}
            className="hidden px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium"
        >
            Help
        </a>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'candidates' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Kandidat Siap Interview
              <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                {interviewCandidates.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'templates' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Bank Soal (Templates)
            </button>
          </div>

          {/* PREVIEW BUTTON */}
          <button 
             onClick={() => {
                 alert("Fitur Preview tersedia di menu Kandidat. (Untuk demo ini, silakan logout dan login kembali, atau akses via menu debug jika ada).");
             }}
             className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
          >
              <Bot className="w-5 h-5" />
              Preview Room Swapers
          </button>
      </div>

      {/* Content */}
      {activeTab === 'candidates' ? (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kandidat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi Melamar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Undangan</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interviewCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                      Belum ada kandidat yang statusnya "Interview". Silakan seleksi kandidat dari Dashboard terlebih dahulu.
                    </td>
                  </tr>
                ) : (
                  interviewCandidates.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full border border-gray-200" src={app.applicantAvatar} alt="" />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                            <div className="text-sm text-gray-500">{app.applicantEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          {getJobTitle(app.jobId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.invitationSent ? (
                          <span className="flex items-center text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 mr-1" /> Undangan Terkirim
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select 
                              className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-1"
                              onChange={(e) => setSelectedTemplateId(e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Pilih Template Soal</option>
                              {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => {
                                if(!selectedTemplateId) return alert("Pilih template soal dulu!");
                                onSendInvite(app.id, selectedTemplateId);
                              }}
                              className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                              title="Kirim Link Interview (Email)"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => window.open(getWhatsAppLink(app), '_blank')}
                                className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                title="Kirim Undangan via WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => onStartLiveSession(app.applicantName)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Mulai Live
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // TEMPLATES TAB
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Templates */}
          <div className="lg:col-span-1 bg-white shadow-sm rounded-xl border border-gray-200 p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Daftar Template</h3>
              <button 
                onClick={() => setIsCreatingTemplate(true)}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {templates.map(template => (
                <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition bg-gray-50">
                  <h4 className="font-bold text-gray-800">{template.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">Dibuat: {template.createdAt}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                      {template.questions.length} Pertanyaan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create/Preview Area */}
          <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 p-8">
            {isCreatingTemplate ? (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Buat Template Baru</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Template</label>
                    <input 
                      type="text" 
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      placeholder="Misal: Tes Logika Programmer React"
                      className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Pertanyaan</label>
                    <div className="space-y-3">
                      {newQuestions.map((q, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="flex-shrink-0 h-10 w-8 flex items-center justify-center text-gray-400 font-bold">{idx + 1}.</span>
                          <input 
                            type="text"
                            value={q}
                            onChange={(e) => handleQuestionChange(idx, e.target.value)}
                            placeholder="Tulis pertanyaan di sini..."
                            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-2 border"
                          />
                          {newQuestions.length > 1 && (
                            <button 
                              onClick={() => {
                                const updated = newQuestions.filter((_, i) => i !== idx);
                                setNewQuestions(updated);
                              }}
                              className="p-2 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={handleAddQuestion}
                      className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Tambah Pertanyaan
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsCreatingTemplate(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleSaveTemplate}
                      className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Simpan Template
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-lg font-medium">Pilih template untuk melihat detail</p>
                <p className="text-sm">atau buat template baru untuk bank soal Anda.</p>
                <button 
                  onClick={() => setIsCreatingTemplate(true)}
                  className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-medium"
                >
                  Buat Template Baru
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewCenter;
