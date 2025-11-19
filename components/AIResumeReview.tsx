import React, { useState, useRef } from 'react';
import { Sparkles, AlertCircle, CheckCircle, XCircle, ChevronRight, FileText, Briefcase } from 'lucide-react';
import { analyzeResumeWithGemini } from '../services/geminiService';
import { AIAnalysisResult } from '../types';

const AIResumeReview: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDesc) {
      alert("Mohon isi teks Resume dan Deskripsi Pekerjaan.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeResumeWithGemini(resumeText, jobDesc);
      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Gagal menganalisis resume. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          AI Resume Analyzer
        </h2>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Cek kecocokan CV Anda dengan lowongan impian dalam hitungan detik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
            <FileText className="w-4 h-4 mr-2 text-indigo-600" />
            Resume / CV (Text)
          </label>
          <textarea
            rows={10}
            className="shadow-inner focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg border p-4 bg-gray-50"
            placeholder="Paste isi CV Anda di sini..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
            <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
            Deskripsi Lowongan
          </label>
          <textarea
            rows={10}
            className="shadow-inner focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg border p-4 bg-gray-50"
            placeholder="Paste kualifikasi pekerjaan di sini..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center mb-16">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:-translate-y-1 ${loading ? 'opacity-75 cursor-not-allowed hover:translate-y-0' : ''}`}
        >
          {loading ? (
            <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang Menganalisis...
            </span>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Analisis Sekarang
            </>
          )}
        </button>
      </div>

      {result && (
        <div ref={resultRef} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 animate-fade-in">
          <div className="bg-indigo-900 p-8 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <h3 className="text-2xl font-bold relative z-10">Hasil Analisis Kecocokan</h3>
             <div className="mt-6 relative z-10 flex justify-center">
                 <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border-4 border-white/20">
                     <span className="text-5xl font-extrabold text-white">{result.score}%</span>
                 </div>
             </div>
             <p className="mt-4 text-indigo-200 relative z-10">{result.summary}</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" /> Kekuatan Utama
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <ChevronRight className="w-4 h-4 mt-1 mr-2 text-green-400 group-hover:text-green-600" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" /> Kekurangan / Gap
              </h4>
              <ul className="space-y-3">
                {result.weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start group">
                    <ChevronRight className="w-4 h-4 mt-1 mr-2 text-red-400 group-hover:text-red-600" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-gray-200">
             <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" /> Rekomendasi Peningkatan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.improvementTips.map((item, idx) => (
                    <div key={idx} className="flex items-start bg-blue-50 p-4 rounded-lg">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-200 text-blue-800 text-xs font-bold mr-3">{idx + 1}</span>
                      <span className="text-blue-900 text-sm font-medium">{item}</span>
                    </div>
                  ))}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResumeReview;