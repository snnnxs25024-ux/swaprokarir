
import React, { useState } from 'react';
import { User, Education, WorkExperience } from '../types';
import { User as UserIcon, FileText, Settings, Upload, Save, LogOut, MapPin, Phone, Plus, Trash2, GraduationCap, Briefcase } from 'lucide-react';

interface CandidateProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'cv' | 'settings'>('bio');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState<User>(user);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      onUpdateUser(formData);
      setIsLoading(false);
      alert("Profil berhasil diperbarui!");
    }, 1000);
  };
  
  const handleInputChange = (field: keyof User, value: any) => {
      setFormData(prev => ({...prev, [field]: value}));
  };

  const addEducation = () => {
      const newEdu: Education = { id: `edu-${Date.now()}`, institution: '', degree: '', major: '', startDate: '', endDate: '' };
      handleInputChange('education', [...(formData.education || []), newEdu]);
  };
  
  const removeEducation = (id: string) => {
      handleInputChange('education', formData.education?.filter(edu => edu.id !== id));
  };
  
  const addExperience = () => {
      const newExp: WorkExperience = { id: `exp-${Date.now()}`, company: '', position: '', startDate: '', endDate: '', description: '' };
      handleInputChange('experience', [...(formData.experience || []), newExp]);
  };

  const removeExperience = (id: string) => {
      handleInputChange('experience', formData.experience?.filter(exp => exp.id !== id));
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profil & CV Saya</h1>
         <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-70 mt-4 md:mt-0"
         >
             {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
              <button 
                onClick={() => setActiveTab('bio')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'bio' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <UserIcon className="w-4 h-4" /> Biodata Diri
              </button>
              <button 
                onClick={() => setActiveTab('cv')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'cv' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FileText className="w-4 h-4" /> CV Builder
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Settings className="w-4 h-4" /> Akun
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8">
                {activeTab === 'bio' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Biodata</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={formData.email} className="w-full rounded-lg border-gray-300 p-2.5 border bg-gray-100" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input type="text" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 pl-10 border" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Domisili</label>
                                 <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 pl-10 border" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                 <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan Diri (Professional Summary)</label>
                                 <textarea rows={4} value={formData.summary} onChange={(e) => handleInputChange('summary', e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 border" />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cv' && (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900">CV Builder</h2>
                        
                        {/* Education Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Pendidikan</h3>
                            {formData.education?.map((edu, index) => (
                                <div key={edu.id} className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 border-gray-100">
                                    {/* Fields for education */}
                                    <input placeholder="Institusi" className="col-span-2 rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Gelar (S1/D3)" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Jurusan" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Tahun Mulai" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Tahun Selesai" className="rounded-lg border-gray-300 p-2 border" />
                                    <button onClick={() => removeEducation(edu.id)} className="col-span-2 text-red-500 text-sm flex items-center gap-1 justify-end"><Trash2 className="w-3 h-3"/> Hapus</button>
                                </div>
                            ))}
                            <button onClick={addEducation} className="text-indigo-600 font-medium text-sm flex items-center gap-1"><Plus className="w-4 h-4"/> Tambah Pendidikan</button>
                        </div>
                        
                         {/* Experience Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengalaman Kerja</h3>
                            {formData.experience?.map((exp, index) => (
                                <div key={exp.id} className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 border-gray-100">
                                     {/* Fields for experience */}
                                    <input placeholder="Perusahaan" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Posisi" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Tanggal Mulai" className="rounded-lg border-gray-300 p-2 border" />
                                    <input placeholder="Tanggal Selesai" className="rounded-lg border-gray-300 p-2 border" />
                                    <textarea placeholder="Deskripsi pekerjaan..." rows={3} className="col-span-2 rounded-lg border-gray-300 p-2 border" />
                                    <button onClick={() => removeExperience(exp.id)} className="col-span-2 text-red-500 text-sm flex items-center gap-1 justify-end"><Trash2 className="w-3 h-3"/> Hapus</button>
                                </div>
                            ))}
                             <button onClick={addExperience} className="text-indigo-600 font-medium text-sm flex items-center gap-1"><Plus className="w-4 h-4"/> Tambah Pengalaman</button>
                        </div>
                    </div>
                )}
                
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Akun</h2>
                        <p className="text-gray-600">Simulasi pengaturan notifikasi dan privasi.</p>
                         <div className="pt-4">
                            <button className="text-sm text-indigo-600 font-medium hover:underline">Ubah Password</button>
                        </div>
                        <div className="mt-8 pt-6 border-t border-red-200">
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 w-full md:w-auto transition"
                             >
                                <LogOut className="w-4 h-4" /> Keluar dari Akun
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

         {/* Right: CV Preview */}
        <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Preview CV</h3>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <img src={formData.avatarUrl} className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-indigo-200" />
                        <h2 className="text-xl font-bold">{formData.name}</h2>
                        <p className="text-sm text-gray-500">{formData.location}</p>
                    </div>

                    {/* Summary */}
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Ringkasan</h4>
                        <p className="text-xs text-gray-600 border-l-2 border-indigo-200 pl-2">{formData.summary}</p>
                    </div>

                     {/* Experience */}
                    <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-600"/> Pengalaman Kerja</h4>
                        <div className="space-y-3">
                            {formData.experience?.map(exp => (
                                <div key={exp.id} className="text-xs">
                                    <p className="font-bold">{exp.position}</p>
                                    <p className="text-gray-600">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Education */}
                     <div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-indigo-600"/> Pendidikan</h4>
                        <div className="space-y-2">
                             {formData.education?.map(edu => (
                                <div key={edu.id} className="text-xs">
                                    <p className="font-bold">{edu.institution}</p>
                                    <p className="text-gray-600">{edu.degree}, {edu.major}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;