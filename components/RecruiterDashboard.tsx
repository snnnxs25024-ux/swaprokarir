
import React from 'react';
import { Job, Application } from '../types';
import { Briefcase, Users, TrendingUp, Search, Eye } from 'lucide-react';

interface RecruiterDashboardProps {
  jobs: Job[];
  applications: Application[];
  onViewApplicants: (jobId: string) => void;
  onPostJob: () => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ jobs, applications, onViewApplicants, onPostJob }) => {
  // Calculate stats
  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const newApplicants = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Rekrutmen</h1>
            <p className="text-gray-500 mt-1">Kelola lowongan dan pantau pelamar terbaik Anda.</p>
        </div>
        <button 
            onClick={onPostJob}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            + Pasang Iklan Baru
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Lowongan Aktif</dt>
                            <dd className="text-2xl font-bold text-gray-900">{totalJobs}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Pelamar</dt>
                            <dd className="text-2xl font-bold text-gray-900">{totalApplicants}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Perlu Review</dt>
                            <dd className="text-2xl font-bold text-gray-900">{newApplicants}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Job List Table */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Daftar Lowongan Pekerjaan</h3>
            <div className="relative rounded-md shadow-sm max-w-xs hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-1.5 border" placeholder="Cari lowongan..." />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi / Judul</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelamar</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Aksi</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => {
                        const jobApplicants = applications.filter(a => a.jobId === job.id).length;
                        return (
                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-lg object-cover border border-gray-200" src={job.logoUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                            <div className="text-sm text-gray-500">{job.company}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {job.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {job.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${jobApplicants > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {jobApplicants} Orang
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Aktif
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => onViewApplicants(job.id)}
                                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 float-right hover:bg-indigo-50 px-3 py-1 rounded-md transition"
                                    >
                                        <Eye className="w-4 h-4" /> Kelola
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
