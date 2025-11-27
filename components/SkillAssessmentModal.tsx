
import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import { SkillBadge } from '../types';

interface SkillAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillName: string;
  onSuccess: () => void;
}

const QUESTIONS: Record<string, { question: string; options: string[]; correct: number }[]> = {
  'React': [
    {
      question: "Apa hook yang digunakan untuk menangani side-effects di React?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: 1
    },
    {
      question: "Apa yang memicu re-render pada komponen React?",
      options: ["Perubahan State atau Props", "Hanya perubahan State", "Hanya perubahan Props", "Tidak ada yang memicu"],
      correct: 0
    },
    {
      question: "Virtual DOM adalah...",
      options: ["Browser API", "Representasi UI di memori", "Database lokal", "Server rendering"],
      correct: 1
    }
  ],
  'TypeScript': [
    {
      question: "Tipe data apa yang mewakili 'tidak ada nilai'?",
      options: ["void", "any", "never", "unknown"],
      correct: 0
    },
    {
      question: "Bagaimana cara mendefinisikan bentuk objek?",
      options: ["Interface", "Function", "Array", "Boolean"],
      correct: 0
    },
    {
      question: "File TypeScript dikompilasi menjadi...",
      options: ["Java", "C++", "JavaScript", "Python"],
      correct: 2
    }
  ]
};

const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({ isOpen, onClose, skillName, onSuccess }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!isOpen) return null;

  // Fallback questions if specific skill questions aren't defined
  const questions = QUESTIONS[skillName] || [
    { question: "Contoh pertanyaan logika 1?", options: ["A", "B", "C", "D"], correct: 0 },
    { question: "Contoh pertanyaan logika 2?", options: ["A", "B", "C", "D"], correct: 1 },
    { question: "Contoh pertanyaan logika 3?", options: ["A", "B", "C", "D"], correct: 2 },
  ];

  const handleNext = () => {
    if (selectedOption === questions[currentQ].correct) {
      setScore(s => s + 1);
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedOption(null);
    } else {
      // Check final score needed (need 100% for this demo)
      const finalScore = selectedOption === questions[currentQ].correct ? score + 1 : score;
      if (finalScore === questions.length) {
          onSuccess();
      }
      setStep('result');
    }
  };

  const isPassed = score === questions.length || (step === 'result' && score === questions.length);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-indigo-900 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg">
                 <Trophy className="w-6 h-6 text-yellow-400" />
             </div>
             <div>
                 <h3 className="text-white font-bold text-lg">{skillName} Assessment</h3>
                 <p className="text-indigo-200 text-xs">Dapatkan lencana Verified</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'intro' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-10 h-10 text-indigo-600" />
              </div>
              <div>
                  <h4 className="text-xl font-bold text-gray-900">Siap untuk tes?</h4>
                  <p className="text-gray-500 mt-2">
                    Anda akan diberikan <strong>{questions.length} pertanyaan</strong>. 
                    Jawab semua dengan benar untuk mendapatkan lencana Verifikasi.
                  </p>
              </div>
              <button 
                onClick={() => setStep('quiz')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Mulai Tes Sekarang
              </button>
            </div>
          )}

          {step === 'quiz' && (
             <div>
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-4">
                    <span>Pertanyaan {currentQ + 1}/{questions.length}</span>
                    <span>Progress</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-6">{questions[currentQ].question}</h4>
                
                <div className="space-y-3 mb-8">
                    {questions[currentQ].options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                selectedOption === idx 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold' 
                                : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentQ === questions.length - 1 ? 'Selesai' : 'Lanjut'}
                </button>
             </div>
          )}

          {step === 'result' && (
             <div className="text-center space-y-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isPassed ? <CheckCircle className="w-12 h-12 text-green-600" /> : <X className="w-12 h-12 text-red-600" />}
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-gray-900">{isPassed ? 'Selamat!' : 'Belum Berhasil'}</h4>
                    <p className="text-gray-500 mt-2">
                        {isPassed 
                            ? `Anda berhasil memverifikasi skill ${skillName}. Lencana telah ditambahkan ke profil Anda.` 
                            : 'Skor Anda belum mencukupi. Silakan pelajari materi dan coba lagi.'}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg ${isPassed ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-gray-800 hover:bg-gray-900'}`}
                >
                    {isPassed ? 'Lihat Profil Saya' : 'Tutup'}
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAssessmentModal;
