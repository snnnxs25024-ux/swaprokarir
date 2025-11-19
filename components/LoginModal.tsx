
import React, { useState } from 'react';
import { X, User, Building2, Loader2 } from 'lucide-react';
import { login } from '../services/authService';
import { User as UserType } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'candidate' | 'recruiter'>('candidate');
  const [email, setEmail] = useState('kandidat@demo.com'); // Default pre-fill for demo UX
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (tab: 'candidate' | 'recruiter') => {
    setActiveTab(tab);
    // Auto-fill credential for easy demo
    if (tab === 'candidate') setEmail('kandidat@demo.com');
    else setEmail('rekruter@demo.com');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await login(email);
      // Basic check to ensure they are logging into correct portal
      if (user.role !== activeTab) {
        throw new Error(`Akun ini bukan akun ${activeTab === 'candidate' ? 'Pencari Kerja' : 'Perusahaan'}`);
      }
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal masuk.");
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
              <h3 className="text-xl font-bold text-gray-900">Masuk ke SWAPRO</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="dummy123" // Dummy password
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Password bebas (Demo Mode)</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Sekarang'}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
             <p className="text-xs text-gray-500 text-center w-full">
               Belum punya akun? <span className="text-indigo-600 font-medium cursor-pointer">Daftar disini</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
