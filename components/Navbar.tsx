import React, { useState } from 'react';
import { Briefcase, Sparkles, MessageSquare, User as UserIcon, Menu, X, LogOut, PlusCircle, LayoutDashboard, Video, Home, Search } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLoginClick, onLogoutClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isCandidate = user?.role === 'candidate';

  // Define Nav Items based on Roles (Desktop & Standard Mobile Menu)
  let navItems = [
    { id: 'home', label: 'Beranda', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'jobs', label: 'Lowongan', icon: <Briefcase className="w-4 h-4" /> },
  ];

  if (user?.role === 'candidate') {
    navItems.push(
        { id: 'candidate-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'ai-resume', label: 'Cek CV (AI)', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'ai-chat', label: 'Konsultasi Karir', icon: <MessageSquare className="w-4 h-4" /> }
    );
  } else if (user?.role === 'recruiter') {
      navItems.push(
          { id: 'recruiter-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'interview-center', label: 'Interview Center', icon: <Video className="w-4 h-4" /> },
          { id: 'post-job', label: 'Pasang Iklan', icon: <PlusCircle className="w-4 h-4" /> }
      );
  } else {
      // Guest view - Show teasers that will trigger login
      navItems.push(
        { id: 'ai-resume', label: 'Cek CV (AI)', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'ai-chat', label: 'Konsultasi Karir', icon: <MessageSquare className="w-4 h-4" /> }
      );
  }

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick('home')}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <img 
                  src="/swapro.png?v=2" 
                  alt="SWAPRO KARIR" 
                  className="h-10 w-auto object-contain" 
                />
                <span className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">SWAPRO KARIR</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 gap-2
                    ${currentView === item.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Section (Auth) */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img src={user.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-gray-200" />
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900 leading-none">{user.name}</span>
                                <span className="text-xs text-gray-500 capitalize">{user.role === 'recruiter' ? 'Rekruter' : 'Kandidat'}</span>
                            </div>
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-1"></div>
                        <button 
                          onClick={onLogoutClick}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Keluar"
                        >
                          <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <>
                       <button className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none">
                          <UserIcon className="w-5 h-5" />
                      </button>
                      <button 
                          onClick={onLoginClick}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      >
                          Masuk
                      </button>
                    </>
                )}
              </div>

               {/* Mobile menu button - Hide for Candidates as they have Bottom Nav */}
              {!isCandidate && (
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown (Only for Non-Candidates or Desktop resizing) */}
        {!isCandidate && isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full left-0 z-40">
            <div className="pt-2 pb-3 space-y-1 px-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-md text-base font-medium transition-colors duration-200
                    ${currentView === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="mr-3 text-indigo-500">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pt-4 pb-6 border-t border-gray-200 bg-gray-50">
              {user ? (
                  <div className="px-5">
                       <div className="flex items-center mb-4">
                          <div className="flex-shrink-0">
                              <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                          </div>
                          <div className="ml-3">
                              <div className="text-base font-medium text-gray-800">{user.name}</div>
                              <div className="text-sm font-medium text-gray-500">{user.email}</div>
                          </div>
                      </div>
                      <button 
                          onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }}
                          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
                      >
                          <LogOut className="w-4 h-4 mr-2" />
                          Keluar
                      </button>
                  </div>
              ) : (
                  <>
                      <div className="flex items-center px-5 mb-4">
                          <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                  <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                          </div>
                          <div className="ml-3">
                              <div className="text-base font-medium text-gray-800">Pengunjung</div>
                              <div className="text-sm font-medium text-gray-500">Tamu</div>
                          </div>
                      </div>
                      <div className="px-5 space-y-2">
                          <button 
                              onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                              Masuk / Daftar
                          </button>
                      </div>
                  </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* BOTTOM NAVIGATION BAR (Mobile Only - Candidate Only) */}
      {isCandidate && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-end pb-4 pt-2 z-[60] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
            <button
                onClick={() => setView('home')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${currentView === 'home' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Beranda</span>
            </button>
            <button
                onClick={() => setView('jobs')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${currentView === 'jobs' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Search className="w-6 h-6" />
                <span className="text-[10px] font-medium">Loker</span>
            </button>

            {/* DOCKED FAB (Floating Action Button) */}
            <div className="relative -top-6">
                <button
                    onClick={() => setView('candidate-dashboard')}
                    className={`p-4 rounded-full shadow-xl border-4 border-gray-50 transition-transform transform active:scale-95 ${
                        currentView === 'candidate-dashboard' 
                            ? 'bg-indigo-700 text-white ring-2 ring-indigo-300' 
                            : 'bg-indigo-600 text-white'
                    }`}
                >
                    <LayoutDashboard className="w-7 h-7" />
                </button>
            </div>

            <button
                onClick={() => setView('ai-chat')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${currentView === 'ai-chat' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px] font-medium">Konsul</span>
            </button>
            <button
                onClick={() => setView('profile')}
                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${currentView === 'profile' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <UserIcon className="w-6 h-6" />
                <span className="text-[10px] font-medium">Profil</span>
            </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
