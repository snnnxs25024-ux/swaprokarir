
import React from 'react';
import { MapPin, Clock, DollarSign, Building, Briefcase, Edit } from 'lucide-react';
import { Job, User } from '../types';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  user: User | null;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, user }) => {
  const isRecruiter = user?.role === 'recruiter';
  // Jika recruiter melihat ini, anggap ini job dia (simplifikasi demo)
  // Di app nyata, cek if job.company === user.companyName

  return (
    <div className="bg-white flex flex-col h-full rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-200 group">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img className="h-12 w-12 rounded-lg object-cover border border-gray-100" src={job.logoUrl} alt={job.company} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
              <div className="flex items-center text-sm text-indigo-600 font-medium mt-1">
                <Building className="flex-shrink-0 mr-1.5 h-4 w-4" />
                <p>{job.company}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
            {job.salaryRange}
          </div>
           <div className="flex items-center text-sm text-gray-600">
            <Clock className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" />
            {job.type} • <span className="ml-1 text-green-600">{job.postedAt}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-50">
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-400">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-between items-center border-t border-gray-100">
        <button 
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            onClick={() => onApply(job)}
        >
            Lihat Detail
        </button>
        
        {isRecruiter ? (
             <button 
                onClick={() => alert("Fitur Edit Lowongan (Demo)")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
                <Edit className="w-4 h-4 mr-2" />
                Edit
            </button>
        ) : (
            <button 
                onClick={() => onApply(job)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-95"
            >
                Lamar Cepat
            </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;