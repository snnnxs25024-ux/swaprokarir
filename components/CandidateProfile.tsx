
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, FileText, Settings, Upload, Save, LogOut, MapPin, Phone } from 'lucide-react';

interface CandidateProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
}

const CandidateProfile: React.FC<CandidateProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'cv' | 'settings'>('bio');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [location, setLocation] = useState('Jakarta, Indonesia');
  const [summary, setSummary] = useState('Frontend Developer antusias dengan pengalaman 2 tahun...');

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = { ...user, name, email };
      onUpdateUser(updatedUser);
      setIsLoading(false);
      alert("Profil berhasil diperbarui!");
    }, 1000);
  };

  const handleFileUpload = () => {
      alert("Simulasi: File CV berhasil diunggah dan diproses oleh AI.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[80vh]">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Pengaturan Profil</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-6 px-2">
             <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200" />
             <div className="overflow-hidden">
                 <h3 className="font-bold text-gray-900 truncate text-sm">{user.name}</h3>
                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
             </div>
          </div>

          <button 
            onClick={() => setActiveTab('bio')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'bio' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <UserIcon className="w-4 h-4" /> Biodata Diri
          </button>
          <button 
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'cv' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FileText className="w-4 h-4" /> CV & Portfolio
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Settings className="w-4 h-4" /> Akun & Keamanan
          </button>

          <div className="mt-auto pt-6 border-t border-gray-200">
             <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition"
             >
                <LogOut className="w-4 h-4" /> Keluar
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
            {activeTab === 'bio' && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Biodata</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 border bg-gray-100" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 pl-10 border" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Domisili</label>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 pl-10 border" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan Diri (Professional Summary)</label>
                             <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full rounded-lg border-gray-300 p-2.5 border" />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'cv' && (
                <div className="space-y-8 animate-fade-in">
                     <h2 className="text-xl font-bold text-gray-900 mb-4">Upload CV & Dokumen</h2>
                     
                     <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-indigo-500 hover:bg-indigo-50 transition cursor-pointer" onClick={handleFileUpload}>
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Klik untuk upload CV baru</h3>
                        <p className="text-sm text-gray-500 mt-1">Format PDF atau DOCX (Max. 5MB)</p>
                     </div>

                     <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-200">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                 <FileText className="w-5 h-5 text-red-600" />
                             </div>
                             <div>
                                 <p className="font-medium text-gray-900">CV_Terbaru_2025.pdf</p>
                                 <p className="text-xs text-gray-500">Diunggah 2 hari lalu</p>
                             </div>
                         </div>
                         <button className="text-sm text-red-600 hover:underline">Hapus</button>
                     </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pengaturan Akun</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Notifikasi Email</p>
                                <p className="text-xs text-gray-500">Terima update lamaran via email</p>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Tampilkan Profil ke Rekruter</p>
                                <p className="text-xs text-gray-500">Izinkan perusahaan melihat profil Anda</p>
                            </div>
                             <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                         <div className="pt-4">
                            <button className="text-sm text-indigo-600 font-medium hover:underline">Ubah Password</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                 <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-70"
                 >
                     {isLoading ? 'Menyimpan...' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
