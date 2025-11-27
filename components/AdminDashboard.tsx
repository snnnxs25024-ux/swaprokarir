
import React, { useState, useEffect } from 'react';
import { User, Job } from '../types';
import { getAdminStats, getAllUsers, getAllJobsForAdmin, deleteJobAsAdmin, suspendUser } from '../services/adminService';
import { ShieldCheck, Users, Briefcase, FileText, Trash2, Ban, Search, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0, applications: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
        const s = await getAdminStats();
        const u = await getAllUsers();
        const j = await getAllJobsForAdmin();
        setStats(s);
        setUsers(u);
        setJobs(j);
    } catch (e) {
        console.error("Failed to load admin data", e);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
      if(confirm("Apakah Anda yakin ingin menghapus lowongan ini secara permanen? Tindakan ini tidak bisa dibatalkan.")) {
          try {
              await deleteJobAsAdmin(jobId);
              setJobs(jobs.filter(j => j.id !== jobId));
              alert("Lowongan berhasil dihapus.");
          } catch (e) {
              alert("Gagal menghapus lowongan.");
          }
      }
  }

  const handleSuspendUser = async (userId: string) => {
      if(confirm("Suspend user ini?")) {
          try {
              await suspendUser(userId);
              loadAdminData(); // Reload to show changes
          } catch (e) {
              alert("Gagal suspend user.");
          }
      }
  }

  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-red-600" />
                    Admin Portal
                </h1>
                <p className="text-gray-500 mt-1">Pusat kendali dan moderasi sistem SWAPRO KARIR.</p>
            </div>
            <button onClick={loadAdminData} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Refresh Data</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Pengguna</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.users}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Lowongan Aktif</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.jobs}</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <Briefcase className="w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Lamaran Masuk</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.applications}</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`${activeTab === 'overview' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`${activeTab === 'users' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Manajemen User
                </button>
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`${activeTab === 'jobs' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                    Moderasi Lowongan
                </button>
            </nav>
        </div>

        {/* SEARCH BAR for Users/Jobs tabs */}
        {activeTab !== 'overview' && (
             <div className="mb-6 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder={`Cari ${activeTab === 'users' ? 'pengguna' : 'lowongan'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        )}

        {/* CONTENT: USERS TABLE */}
        {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((u) => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={u.avatarUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                            <div className="text-sm text-gray-500">{u.email}</div>
                                            {u.companyName && <div className="text-xs text-indigo-600">{u.companyName}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'recruiter' ? 'bg-green-100 text-green-800' : u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Active
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleSuspendUser(u.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end w-full">
                                            <Ban className="w-4 h-4" /> Suspend
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* CONTENT: JOBS TABLE */}
        {activeTab === 'jobs' && (
            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diposting</th>
                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredJobs.map((job) => (
                            <tr key={job.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                    <div className="text-xs text-gray-500">{job.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded object-cover mr-2" src={job.logoUrl} alt="" />
                                        <span className="text-sm text-gray-900">{job.company}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {job.postedAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1 justify-end w-full">
                                        <Trash2 className="w-4 h-4" /> Hapus Iklan
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        )}
        
        {activeTab === 'overview' && (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">Selamat Datang di Panel Admin</h3>
                <p className="mt-2">Pilih menu di atas untuk mengelola data pengguna dan konten aplikasi.</p>
            </div>
        )}

    </div>
  );
};

export default AdminDashboard;
