
import React from 'react';
import { Application, Job } from '../types';
import { ArrowLeft, Archive, Search, Mail, Phone, Briefcase } from 'lucide-react';

interface TalentPoolProps {
  applications: Application[];
  jobs: Job[];
  onBack: () => void;
  onViewApplicant: (app: Application) => void;
}

const TalentPool: React.FC<TalentPoolProps> = ({ applications, jobs, onBack, onViewApplicant }) => {
  const talentPoolApps = applications.filter(a => a.status === 'talent-pool');

  const getJobTitle = (jobId: string) => {
    return jobs.find(j => j.id === jobId)?.title || 'Posisi Tidak Diketahui';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Archive className="w-7 h-7 text-purple-600" />
                    Talent Pool
                </h1>
                <p className="text-gray-500 mt-1">Database kandidat potensial Anda untuk kebutuhan di masa depan.</p>
            </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{talentPoolApps.length} Kandidat Tersimpan</h3>
                <div className="relative rounded-md shadow-sm max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="text" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-1.5 border" placeholder="Cari skill atau nama..." />
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kandidat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontak</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pernah Melamar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skor AI Terakhir</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {talentPoolApps.map(app => (
                             <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={app.applicantAvatar} alt="" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                                            <div className="text-sm text-gray-500">{app.location}</div>
                                        </div>
                                    </div>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400"/> {app.applicantEmail}</div>
                                    <div className="flex items-center gap-2 mt-1"><Phone className="w-4 h-4 text-gray-400"/> {app.phoneNumber}</div>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                     <div className="flex items-center gap-2 font-medium"><Briefcase className="w-4 h-4 text-gray-400"/> {getJobTitle(app.jobId)}</div>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-base font-bold text-indigo-600">{app.aiMatchScore}%</span>
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                     <button onClick={() => alert('Fitur ini akan membuka kembali profil kandidat di halaman Applicant List.')} className="text-indigo-600 hover:text-indigo-900">
                                         Lihat Profil
                                     </button>
                                 </td>
                             </tr>
                        ))}
                        {talentPoolApps.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500 italic">Talent Pool Anda masih kosong.</td>
                            </tr>
                        )}
                     </tbody>
                </table>
             </div>
        </div>
    </div>
  );
};

export default TalentPool;
