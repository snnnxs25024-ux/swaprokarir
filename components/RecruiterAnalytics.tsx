
import React from 'react';
import { Application, Job } from '../types';
import { ArrowLeft, BarChart3, Users, Filter, Briefcase, TrendingUp } from 'lucide-react';

interface RecruiterAnalyticsProps {
  applications: Application[];
  jobs: Job[];
  onBack: () => void;
}

const RecruiterAnalytics: React.FC<RecruiterAnalyticsProps> = ({ applications, jobs, onBack }) => {

  const totalApplications = applications.length;
  const statusCounts = {
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getPercentage = (count: number) => {
    return totalApplications > 0 ? ((count / totalApplications) * 100).toFixed(1) : '0.0';
  }

  const jobPerformance = jobs.map(job => ({
    title: job.title,
    applicantCount: applications.filter(a => a.jobId === job.id).length
  })).sort((a, b) => b.applicantCount - a.applicantCount).slice(0, 5);
  
  const maxApplicants = Math.max(...jobPerformance.map(j => j.applicantCount), 0) || 1;
  
  // Dummy data for trend chart
  const trendData = [
    { day: 'Sen', count: 5 },
    { day: 'Sel', count: 8 },
    { day: 'Rab', count: 12 },
    { day: 'Kam', count: 10 },
    { day: 'Jum', count: 15 },
    { day: 'Sab', count: 7 },
    { day: 'Min', count: 4 },
  ];
  const maxTrend = Math.max(...trendData.map(d => d.count)) || 1;


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-indigo-600" />
                    Analitik Rekrutmen
                </h1>
                <p className="text-gray-500 mt-1">Wawasan data untuk optimasi proses rekrutmen Anda.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Funnel */}
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    Applicant Funnel
                </h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Pelamar</span>
                        <span className="text-lg font-bold text-indigo-700">{totalApplications}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '100%'}}></div>
                    </div>

                    <div className="space-y-3 pt-4">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-semibold capitalize text-gray-600">{status}</span>
                                    <span className="text-gray-500">{count} ({getPercentage(count)}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${getPercentage(count)}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Performance and Trend */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        Performa Lowongan (Top 5)
                    </h2>
                    <div className="space-y-4">
                        {jobPerformance.map((job, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1">
                                      <div className="bg-indigo-500 h-2.5 rounded-full" style={{width: `${(job.applicantCount / maxApplicants) * 100}%`}}></div>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-indigo-600 w-12 text-right">{job.applicantCount}</span>
                            </div>
                        ))}
                         {jobPerformance.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Data belum tersedia.</p>}
                    </div>
                </div>
                
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Tren Pelamar (7 Hari Terakhir)
                    </h2>
                    <div className="flex justify-between items-end h-40 gap-2">
                        {trendData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                                <div 
                                    className="w-3/4 bg-indigo-200 rounded-t-lg group-hover:bg-indigo-500 transition-all"
                                    style={{ height: `${(data.count / maxTrend) * 100}%` }}
                                >
                                  <div className="text-center text-xs font-bold text-indigo-800 opacity-0 group-hover:opacity-100 -mt-5">{data.count}</div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium mt-2">{data.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RecruiterAnalytics;