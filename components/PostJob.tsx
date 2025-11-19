
import React, { useState } from 'react';
import { Briefcase, DollarSign, MapPin, PlusCircle } from 'lucide-react';
import { Job, JobType } from '../types';

interface PostJobProps {
  onPostJob: (job: Job) => void;
  companyName: string;
}

const PostJob: React.FC<PostJobProps> = ({ onPostJob, companyName }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryRange: '',
    type: JobType.FULL_TIME,
    description: '',
    requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      company: companyName,
      location: formData.location,
      type: formData.type,
      salaryRange: formData.salaryRange,
      description: formData.description,
      requirements: formData.requirements.split(',').map(r => r.trim()),
      postedAt: 'Baru saja',
      logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`
    };

    onPostJob(newJob);
    alert('Lowongan berhasil diterbitkan!');
    // Reset form
    setFormData({
        title: '',
        location: '',
        salaryRange: '',
        type: JobType.FULL_TIME,
        description: '',
        requirements: ''
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-6 h-6" />
                Pasang Iklan Lowongan Baru
            </h2>
            <p className="text-indigo-100 text-sm mt-1">Perusahaan: {companyName}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judul Posisi</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                            placeholder="Contoh: Senior Marketing"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                            placeholder="Jakarta, Remote..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Gaji</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.salaryRange}
                            onChange={e => setFormData({...formData, salaryRange: e.target.value})}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border py-2"
                            placeholder="Rp 5.000.000 - Rp 10.000.000"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Pekerjaan</label>
                    <select
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as JobType})}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border py-2 px-3"
                    >
                        {Object.values(JobType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Pekerjaan</label>
                <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-3"
                    placeholder="Jelaskan tanggung jawab dan gambaran pekerjaan..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Persyaratan (Pisahkan dengan koma)</label>
                <textarea
                    rows={3}
                    required
                    value={formData.requirements}
                    onChange={e => setFormData({...formData, requirements: e.target.value})}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md border p-3"
                    placeholder="React, TypeScript, Minimal 2 tahun pengalaman..."
                />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Terbitkan Lowongan
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
