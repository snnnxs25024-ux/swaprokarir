
import React, { useState } from 'react';
import { X, User, Building2, Loader2, Mail, Lock } from 'lucide-react';
import { login, register } from '../services/authService';
import { User as UserType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>('candidate');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (tab: 'candidate' | 'recruiter') => {
    setActiveTab(tab);
    setError('');
  };

  const toggleMode = () => {
      setMode(mode === 'login' ? 'register' : 'login');
      setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'register') {
          // Metadata for profiles table
          const metadata = {
              name: name,
              role: activeTab,
              avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
              companyName: activeTab === 'recruiter' ? companyName : null
          };
          
          const newUser = await register(email, password, metadata);
          alert("Registrasi berhasil! Silakan login.");
          setMode('login');
          // Optional: Auto login or wait for email confirmation depending on Supabase settings
      } else {
          // Real Login
          const user = await login(email, password);
          if (user.role !== activeTab) {
            throw new Error(`Email ini terdaftar sebagai ${user.role}, bukan ${activeTab}`);
          }
          onLoginSuccess(user);
          onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">
                  {mode === 'login' ? 'Masuk ke SWAPRO' : 'Daftar Akun Baru'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Role Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => handleTabChange('candidate')}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'candidate' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Pencari Kerja
              </button>
              <button
                onClick={() => handleTabChange('recruiter')}
                className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'recruiter' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Perusahaan
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Contoh: Budi Santoso"
                        />
                    </div>
                  </div>
              )}

              {mode === 'register' && activeTab === 'recruiter' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="PT Sukses Makmur"
                        />
                    </div>
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="nama@email.com"
                    />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    minLength={6}
                    />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang')}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-center">
             <button 
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-2 transition-colors"
             >
               {mode === 'login' ? (
                   <>Belum punya akun? <span className="text-indigo-600">Daftar disini</span></>
               ) : (
                   <>Sudah punya akun? <span className="text-indigo-600">Masuk disini</span></>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
