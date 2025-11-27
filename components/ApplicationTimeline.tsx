
import React from 'react';
import { Application, ApplicationStatus } from '../types';
import { CheckCircle, Circle, Clock, XCircle, Calendar } from 'lucide-react';

interface ApplicationTimelineProps {
  application: Application;
  onClose: () => void;
}

const STEPS: ApplicationStatus[] = ['pending', 'reviewed', 'interview', 'hired'];

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ application, onClose }) => {
  
  const getStepStatus = (step: ApplicationStatus) => {
    const statusOrder = ['pending', 'reviewed', 'interview', 'hired'];
    const currentIdx = statusOrder.indexOf(application.status);
    const stepIdx = statusOrder.indexOf(step);

    if (application.status === 'rejected') return 'rejected'; // Special case
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const getGoogleCalendarLink = () => {
      // Mock data for calendar link
      const title = encodeURIComponent(`Interview di ${application.companyName || 'Perusahaan'}`);
      const details = encodeURIComponent(`Interview untuk posisi ${application.jobTitle}`);
      // Assume interview is tomorrow at 10 AM for demo
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const start = tomorrow.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const end = new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
                <h3 className="font-bold text-xl text-gray-900">{application.jobTitle || 'Posisi'}</h3>
                <p className="text-gray-500 text-sm">{application.companyName || 'Perusahaan'}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>

        <div className="p-8">
            {/* Timeline */}
            <div className="relative">
                {application.status === 'rejected' ? (
                     <div className="flex flex-col items-center justify-center text-center py-8">
                         <XCircle className="w-16 h-16 text-red-500 mb-4" />
                         <h4 className="text-lg font-bold text-gray-900">Lamaran Tidak Dilanjutkan</h4>
                         <p className="text-gray-500 mt-2">Jangan patah semangat! Masih banyak peluang lain yang menanti Anda.</p>
                     </div>
                ) : (
                    <div className="space-y-8">
                        {STEPS.map((step, idx) => {
                            const status = getStepStatus(step);
                            const isLast = idx === STEPS.length - 1;
                            
                            return (
                                <div key={step} className="relative flex items-start group">
                                    {/* Vertical Line */}
                                    {!isLast && (
                                        <div className={`absolute left-3.5 top-8 w-0.5 h-full ${status === 'completed' ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ height: 'calc(100% + 1rem)' }}></div>
                                    )}

                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${
                                        status === 'completed' || status === 'current' 
                                        ? 'border-indigo-600 bg-indigo-600 text-white' 
                                        : 'border-gray-300 bg-white text-gray-300'
                                    }`}>
                                        {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                                         status === 'current' ? <Clock className="w-5 h-5 animate-pulse" /> :
                                         <Circle className="w-4 h-4" />}
                                    </div>
                                    
                                    <div className="ml-4 min-w-0 flex-1">
                                        <div className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                                            {step.replace('-', ' ')}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {status === 'completed' ? 'Selesai' : 
                                             status === 'current' ? 'Sedang Diproses' : 
                                             'Menunggu Giliran'}
                                        </p>
                                        
                                        {/* Feature: Calendar Integration for Interview */}
                                        {step === 'interview' && status === 'current' && (
                                            <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                                    <div>
                                                        <p className="text-sm font-bold text-indigo-900">Jadwal Interview Tersedia</p>
                                                        <p className="text-xs text-indigo-700">Silakan cek email atau tambahkan ke kalender.</p>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={getGoogleCalendarLink()} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="mt-3 inline-flex items-center text-xs font-bold text-white bg-indigo-600 px-3 py-2 rounded hover:bg-indigo-700 transition"
                                                >
                                                    + Add to Google Calendar
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;
