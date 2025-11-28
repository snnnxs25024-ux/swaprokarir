
import React, { useState, useEffect, useRef } from 'react';
import { User, Education, WorkExperience, SkillBadge, SocialLinks } from '../types';
import { User as UserIcon, FileText, Settings, Save, LogOut, MapPin, Phone, Plus, Trash2, Linkedin, Github, Globe, Sparkles, Loader2, ChevronDown, ChevronUp, X, Camera, Calendar, Facebook, Twitter, Instagram } from 'lucide-react';
import { generateProfileSummary } from '../services/geminiService';
import { updateProfile, uploadAvatar } from '../services/authService';

interface CandidateProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'cv' | 'settings'>('bio');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<User>(user);
  const [newSkill, setNewSkill] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expanded states for accordion UI
  const [expandedEdu, setExpandedEdu] = useState<string | null>(null);
  const [expandedExp, setExpandedExp] = useState<string | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
        await updateProfile(formData);
        onUpdateUser(formData);
        alert("Profil berhasil diperbarui!");
    } catch (error) {
        console.error(error);
        alert("Gagal menyimpan profil. Coba lagi.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSocialChange = (field: keyof SocialLinks, value: string) => {
      setFormData(prev => ({
          ...prev,
          socialLinks: {
              ...(prev.socialLinks || {}), // Ensure object exists
              [field]: value
          }
      }));
  };

  const handleNestedChange = (
    section: 'education' | 'experience',
    id: string,
    field: keyof Education | keyof WorkExperience,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[])?.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };
  
  const addEducation = () => {
    const newId = `edu-${Date.now()}`;
    const newEdu: Education = { id: newId, institution: '', degree: '', major: '', startDate: '', endDate: '' };
    handleInputChange('education', [...(formData.education || []), newEdu]);
    setExpandedEdu(newId);
  };
  
  const removeEducation = (id: string) => {
    handleInputChange('education', formData.education?.filter(edu => edu.id !== id));
  };
  
  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: WorkExperience = { id: newId, company: '', position: '', startDate: '', endDate: '', description: '' };
    handleInputChange('experience', [...(formData.experience || []), newExp]);
    setExpandedExp(newId);
  };

  const removeExperience = (id: string) => {
    handleInputChange('experience', formData.experience?.filter(exp => exp.id !== id));
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && newSkill.trim()) {
          e.preventDefault();
          const skill: SkillBadge = {
              id: `skill-${Date.now()}`,
              name: newSkill.trim(),
              level: 'Intermediate',
              verified: false
          };
          handleInputChange('skills', [...(formData.skills || []), skill]);
          setNewSkill('');
      }
  };

  const removeSkill = (id: string) => {
      handleInputChange('skills', formData.skills?.filter(s => s.id !== id));
  };

  const handleGenerateSummary = async () => {
      setIsAiLoading(true);
      try {
          const summary = await generateProfileSummary(formData);
          handleInputChange('summary', summary);
      } catch (error) {
          alert("Gagal membuat summary. Pastikan data profil cukup lengkap.");
      } finally {
          setIsAiLoading(false);
      }
  };

  // --- Upload Logic ---
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          // Validasi ukuran (max 2MB)
          if (file.size > 2 * 1024 * 1024) {
              alert("Ukuran file maksimal 2MB");
              return;
          }
          
          setIsUploading(true);
          try {
              const publicUrl = await uploadAvatar(file, user.id);
              handleInputChange('avatarUrl', publicUrl);
              // Auto save agar URL tidak hilang
              await updateProfile({ ...formData, avatarUrl: publicUrl });
              onUpdateUser({ ...formData, avatarUrl: publicUrl }); // Update global state immediately
          } catch (error) {
              console.error("Upload failed:", error);
              alert("Gagal mengunggah foto.");
          } finally {
              setIsUploading(false);
          }
      }
  };

  const triggerFileInput = () => {
      fileInputRef.current?.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profil & CV Saya</h1>
         <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-70 mt-4 md:mt-0 w-fit"
         >
             {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form Inputs */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            {/* Sidebar Tabs */}
            <div className="w-full bg-gray-50 border-b border-gray-200 p-2 flex gap-2 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('bio')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'bio' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <UserIcon className="w-4 h-4" /> Data Diri
              </button>
              <button 
                onClick={() => setActiveTab('cv')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'cv' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FileText className="w-4 h-4" /> CV & Skill
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'settings' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Settings className="w-4 h-4" /> Akun
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8">
                {activeTab === 'bio' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Foto Profil Section */}
                        <div className="flex flex-col items-center justify-center pb-6 border-b border-gray-100">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-50 shadow-lg">
                                    {isUploading ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                        </div>
                                    ) : (
                                        <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                                    )}
                                </div>
                                <button 
                                    onClick={triggerFileInput}
                                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition transform hover:scale-105 border-2 border-white"
                                    title="Ganti Foto"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Klik ikon kamera untuk mengganti foto</p>
                        </div>

                        {/* Informasi Dasar */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Informasi Dasar
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Lengkap</label>
                                    <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nomor Telepon</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input type="text" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                                    </div>
                                </div>
                                
                                {/* Tempat & Tanggal Lahir */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tempat Lahir</label>
                                    <input 
                                        type="text" 
                                        value={formData.birthPlace || ''} 
                                        onChange={(e) => handleInputChange('birthPlace', e.target.value)} 
                                        className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                        placeholder="Contoh: Jakarta"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Tanggal Lahir</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="date" 
                                            value={formData.birthDate || ''} 
                                            onChange={(e) => {
                                                handleInputChange('birthDate', e.target.value);
                                                // Auto calculate age
                                                if(e.target.value){
                                                    const age = new Date().getFullYear() - new Date(e.target.value).getFullYear();
                                                    handleInputChange('age', age);
                                                }
                                            }} 
                                            className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                        />
                                    </div>
                                </div>

                                {/* Agama & Lokasi */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Agama</label>
                                    <select 
                                        value={formData.religion || ''} 
                                        onChange={(e) => handleInputChange('religion', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                    >
                                        <option value="">Pilih Agama</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Kristen Protestan">Kristen Protestan</option>
                                        <option value="Katolik">Katolik</option>
                                        <option value="Hindu">Hindu</option>
                                        <option value="Buddha">Buddha</option>
                                        <option value="Konghucu">Konghucu</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Kota Domisili</label>
                                     <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input type="text" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                                    </div>
                                </div>

                                {/* Alamat Lengkap */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Alamat Lengkap</label>
                                    <textarea 
                                        rows={3} 
                                        value={formData.address || ''} 
                                        onChange={(e) => handleInputChange('address', e.target.value)} 
                                        className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                        placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan..." 
                                    />
                                </div>

                                {/* Bio Summary */}
                                <div className="md:col-span-2">
                                     <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Ringkasan Profesional</label>
                                        <button 
                                            onClick={handleGenerateSummary}
                                            disabled={isAiLoading}
                                            className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded-md transition disabled:opacity-50"
                                        >
                                            {isAiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                            Bantu Tulis dengan AI
                                        </button>
                                     </div>
                                     <textarea rows={4} value={formData.summary} onChange={(e) => handleInputChange('summary', e.target.value)} className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="Ceritakan sedikit tentang diri Anda..." />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                             <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                Social & Portfolio
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Linkedin className="absolute left-3 top-3.5 w-4 h-4 text-blue-600" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.linkedin || ''} 
                                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                        placeholder="LinkedIn URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                                <div className="relative">
                                    <Github className="absolute left-3 top-3.5 w-4 h-4 text-gray-800" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.github || ''} 
                                        onChange={(e) => handleSocialChange('github', e.target.value)}
                                        placeholder="GitHub URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3.5 w-4 h-4 text-indigo-500" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.portfolio || ''} 
                                        onChange={(e) => handleSocialChange('portfolio', e.target.value)}
                                        placeholder="Portfolio Website URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3.5 w-4 h-4 text-pink-600" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.instagram || ''} 
                                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                        placeholder="Instagram URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                                <div className="relative">
                                    <Twitter className="absolute left-3 top-3.5 w-4 h-4 text-blue-400" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.twitter || ''} 
                                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                        placeholder="Twitter / X URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                                 <div className="relative">
                                    <Facebook className="absolute left-3 top-3.5 w-4 h-4 text-blue-800" />
                                    <input 
                                        type="text" 
                                        value={formData.socialLinks?.facebook || ''} 
                                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                        placeholder="Facebook URL"
                                        className="w-full rounded-lg border-gray-300 p-3 pl-10 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cv' && (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* SKILLS SECTION */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Keahlian (Skills)</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.skills?.map((skill) => (
                                    <span key={skill.id} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${skill.verified ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                        {skill.name}
                                        <button onClick={() => removeSkill(skill.id)} className="ml-2 text-gray-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                type="text" 
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleAddSkill}
                                placeholder="Ketik skill lalu Enter (Contoh: Photoshop)"
                                className="w-full rounded-lg border-gray-300 p-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>

                        <hr className="border-gray-100" />
                        
                        {/* EXPERIENCE SECTION */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Pengalaman Kerja</h3>
                                <button onClick={addExperience} className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition">
                                    <Plus className="w-4 h-4"/> Tambah
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.experience?.map((exp, index) => (
                                    <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden transition-all">
                                        <div 
                                            className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                            onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-800">{exp.position || '(Posisi)'}</h4>
                                                <p className="text-xs text-gray-500">{exp.company || '(Perusahaan)'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {expandedExp === exp.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>
                                        </div>
                                        
                                        {expandedExp === exp.id && (
                                            <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4 relative">
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Posisi</label>
                                                    <input value={exp.position} onChange={e => handleNestedChange('experience', exp.id, 'position', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" />
                                                </div>
                                                <div className="col-span-2 md:col-span-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Perusahaan</label>
                                                    <input value={exp.company} onChange={e => handleNestedChange('experience', exp.id, 'company', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Mulai</label>
                                                    <input value={exp.startDate} onChange={e => handleNestedChange('experience', exp.id, 'startDate', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" placeholder="Tahun" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Selesai</label>
                                                    <input value={exp.endDate} onChange={e => handleNestedChange('experience', exp.id, 'endDate', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" placeholder="Tahun / Sekarang" />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-xs text-gray-500 mb-1">Deskripsi</label>
                                                    <textarea value={exp.description} onChange={e => handleNestedChange('experience', exp.id, 'description', e.target.value)} rows={3} className="w-full rounded-md border-gray-300 p-2 border text-sm" />
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }} 
                                                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!formData.experience || formData.experience.length === 0) && <p className="text-sm text-gray-400 italic text-center py-4">Belum ada pengalaman kerja.</p>}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* EDUCATION SECTION */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Pendidikan</h3>
                                <button onClick={addEducation} className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition">
                                    <Plus className="w-4 h-4"/> Tambah
                                </button>
                            </div>
                             <div className="space-y-4">
                                {formData.education?.map((edu, index) => (
                                    <div key={edu.id} className="border border-gray-200 rounded-xl overflow-hidden transition-all">
                                        <div 
                                            className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                            onClick={() => setExpandedEdu(expandedEdu === edu.id ? null : edu.id)}
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-800">{edu.institution || '(Institusi)'}</h4>
                                                <p className="text-xs text-gray-500">{edu.degree} {edu.major}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {expandedEdu === edu.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            </div>
                                        </div>
                                        
                                        {expandedEdu === edu.id && (
                                            <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4 relative">
                                                <div className="col-span-2">
                                                    <label className="block text-xs text-gray-500 mb-1">Institusi</label>
                                                    <input value={edu.institution} onChange={e => handleNestedChange('education', edu.id, 'institution', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Gelar</label>
                                                    <input value={edu.degree} onChange={e => handleNestedChange('education', edu.id, 'degree', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" placeholder="S1/D3/SMA" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Jurusan</label>
                                                    <input value={edu.major} onChange={e => handleNestedChange('education', edu.id, 'major', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Mulai</label>
                                                    <input value={edu.startDate} onChange={e => handleNestedChange('education', edu.id, 'startDate', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" placeholder="Tahun" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Selesai</label>
                                                    <input value={edu.endDate} onChange={e => handleNestedChange('education', edu.id, 'endDate', e.target.value)} className="w-full rounded-md border-gray-300 p-2 border text-sm" placeholder="Tahun" />
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }} 
                                                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Akun</h2>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input type="email" value={formData.email} className="w-full rounded-lg border-gray-300 p-2.5 border bg-gray-100 text-gray-500" readOnly />
                          <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ubah Password</label>
                          <input type="password" placeholder="Password baru" className="w-full rounded-lg border-gray-300 p-2.5 border mb-2" />
                           <input type="password" placeholder="Konfirmasi password baru" className="w-full rounded-lg border-gray-300 p-2.5 border" />
                        </div>
                        <div className="mt-8 pt-6 border-t border-red-200">
                            <button 
                                onClick={onLogout}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 w-full md:w-auto transition justify-center"
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
             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24 min-h-[600px]">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Preview CV</h3>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Live Update</div>
                </div>
                
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <img src={formData.avatarUrl} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-50 shadow-sm object-cover" />
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{formData.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{formData.location}</p>
                        
                        {/* Social Links */}
                        <div className="flex justify-center gap-3 mt-3">
                            {formData.socialLinks?.linkedin && <a href={`https://${formData.socialLinks.linkedin}`} target="_blank" className="text-gray-400 hover:text-blue-600"><Linkedin className="w-4 h-4"/></a>}
                            {formData.socialLinks?.github && <a href={`https://${formData.socialLinks.github}`} target="_blank" className="text-gray-400 hover:text-gray-900"><Github className="w-4 h-4"/></a>}
                            {formData.socialLinks?.portfolio && <a href={`https://${formData.socialLinks.portfolio}`} target="_blank" className="text-gray-400 hover:text-indigo-600"><Globe className="w-4 h-4"/></a>}
                            {formData.socialLinks?.instagram && <a href={`https://${formData.socialLinks.instagram}`} target="_blank" className="text-gray-400 hover:text-pink-600"><Instagram className="w-4 h-4"/></a>}
                        </div>
                    </div>

                    {/* Summary */}
                    {formData.summary && (
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Ringkasan</h4>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">{formData.summary}</p>
                        </div>
                    )}
                    
                    {/* Skills */}
                    {formData.skills && formData.skills.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">Keahlian</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {formData.skills.map(s => (
                                    <span key={s.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{s.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                     {/* Experience */}
                    {formData.experience && formData.experience.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 border-b border-gray-100 pb-1 flex items-center gap-2">Pengalaman Kerja</h4>
                            <div className="space-y-4">
                                {formData.experience.map(exp => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-100">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></div>
                                        <h5 className="font-bold text-sm text-gray-900">{exp.position}</h5>
                                        <div className="text-xs text-gray-500 mb-1 flex justify-between">
                                            <span className="font-medium">{exp.company}</span>
                                            <span>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-snug line-clamp-3">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                     {/* Education */}
                     {formData.education && formData.education.length > 0 && (
                        <div>
                            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 border-b border-gray-100 pb-1 flex items-center gap-2">Pendidikan</h4>
                            <div className="space-y-3">
                                 {formData.education.map(edu => (
                                    <div key={edu.id} className="text-sm">
                                        <div className="flex justify-between">
                                            <p className="font-bold text-gray-900">{edu.institution}</p>
                                            <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                        </div>
                                        <p className="text-gray-600 text-xs">{edu.degree} {edu.major}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
