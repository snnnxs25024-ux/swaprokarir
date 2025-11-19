
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Video, AlertCircle, Bot, Volume2, Loader2 } from 'lucide-react';
import { validateVoiceAnswer } from '../services/geminiService';

// Polyfill/Type definition for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SwapersInterviewProps {
  candidateName: string;
  questions: string[];
  onComplete: () => void;
}

const SwapersInterview: React.FC<SwapersInterviewProps> = ({ candidateName, questions, onComplete }) => {
  // State Flow
  const [currentStep, setCurrentStep] = useState<'permission' | 'intro' | 'question' | 'listening' | 'processing' | 'completed'>('permission');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [swapersFeedback, setSwapersFeedback] = useState('');
  
  // Hardware State
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // 1. Initialize Camera (Proctoring)
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error(err);
        setCameraError(true);
      }
    };
    initCamera();

    return () => {
       // Cleanup stream
       if (videoRef.current && videoRef.current.srcObject) {
           const stream = videoRef.current.srcObject as MediaStream;
           stream.getTracks().forEach(t => t.stop());
       }
       // Cancel speech
       synthRef.current.cancel();
    };
  }, []);

  // 2. Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'id-ID'; // Focus on Indonesian
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleAnswerSubmission(text);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        // If error (e.g. no-speech), Swapers prompts again
        speak("Maaf, saya tidak mendengar suara Anda. Mohon ulangi jawaban Anda.", () => {
             startListening();
        });
      };

      recognitionRef.current = recognition;
    } else {
      alert("Browser Anda tidak mendukung fitur Speech-to-Text. Mohon gunakan Chrome/Edge.");
    }
  }, [questionIndex]); // Re-init not strictly needed but safe

  // 3. Swapers Speaking Logic (TTS)
  const speak = (text: string, onEndCallback?: () => void) => {
    // Cancel previous speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to find an Indonesian voice
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    setSwapersFeedback(text); // Show text on screen too
    synthRef.current.speak(utterance);
  };

  // 4. Main Flow Control
  const startInterview = () => {
    setCurrentStep('intro');
    speak(`Halo ${candidateName}, saya Swapers. Agen AI yang akan mewawancarai Anda hari ini. Pastikan Anda di ruangan yang tenang. Kita mulai ya?`, () => {
        nextQuestion();
    });
  };

  const nextQuestion = () => {
    if (questionIndex >= questions.length) {
      setCurrentStep('completed');
      speak("Terima kasih. Sesi wawancara telah selesai. Kami akan menganalisis jawaban Anda dan menghubungi segera.", () => {
          setTimeout(onComplete, 2000);
      });
      return;
    }

    setCurrentStep('question');
    const q = questions[questionIndex];
    speak(`Pertanyaan nomor ${questionIndex + 1}. ${q}`, () => {
        startListening();
    });
  };

  const startListening = () => {
    setCurrentStep('listening');
    setTranscript('');
    try {
        recognitionRef.current.start();
    } catch(e) {
        // Handle if already started
        console.log("Recognition already active");
    }
  };

  const handleAnswerSubmission = async (text: string) => {
    setCurrentStep('processing');
    
    // AI Logic: Validate the answer
    const currentQ = questions[questionIndex];
    const validation = await validateVoiceAnswer(text, currentQ);

    if (validation.isValid) {
        // Valid answer
        speak(validation.feedback, () => {
            setQuestionIndex(prev => prev + 1);
            // Use timeout to prevent state clash
            setTimeout(() => nextQuestion(), 500); 
        });
    } else {
        // Invalid (Noise/Unclear)
        speak(validation.feedback, () => {
            startListening(); // Retry same question
        });
    }
  };

  // Render Permission Denied
  if (cameraError) {
      return (
          <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-8 text-center">
              <div>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Akses Kamera/Mic Ditolak</h2>
                  <p>Sistem proctoring mewajibkan Anda mengaktifkan kamera dan mikrofon untuk melanjutkan wawancara ini.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 overflow-hidden">
        
        {/* Header Proctoring Info */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md z-10">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-mono tracking-wider">REC • PROCTORING ACTIVE</span>
        </div>

        {/* Main Layout */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6 items-center">
            
            {/* Left: Swapers Avatar (AI) */}
            <div className="flex flex-col items-center justify-center space-y-8">
                <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 border-indigo-500/30 shadow-[0_0_60px_-10px_rgba(99,102,241,0.3)] transition-all duration-500 ${currentStep === 'question' || currentStep === 'processing' ? 'scale-110 border-indigo-500' : ''}`}>
                    <div className={`absolute inset-0 bg-indigo-600 rounded-full opacity-10 ${currentStep === 'question' ? 'animate-ping' : ''}`}></div>
                    <div className="bg-gradient-to-b from-indigo-600 to-purple-700 w-40 h-40 rounded-full flex items-center justify-center relative z-10">
                        <Bot className="w-20 h-20 text-white" />
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="absolute -bottom-12 text-center w-full">
                        <h3 className="text-white text-xl font-bold tracking-wide">SWAPERS AI</h3>
                        <p className="text-indigo-300 text-sm font-medium animate-pulse">
                            {currentStep === 'listening' ? 'Mendengarkan...' : 
                             currentStep === 'processing' ? 'Menganalisis...' : 
                             currentStep === 'question' || currentStep === 'intro' ? 'Berbicara...' : 'Standby'}
                        </p>
                    </div>
                </div>

                {/* Transcript / Feedback Bubble */}
                <div className="bg-gray-800/80 backdrop-blur border border-gray-700 p-6 rounded-2xl w-full max-w-md min-h-[140px] flex items-center justify-center text-center shadow-xl relative">
                     {currentStep === 'listening' && (
                         <div className="absolute top-2 right-2">
                             <Mic className="w-4 h-4 text-red-400 animate-pulse" />
                         </div>
                     )}
                     <p className="text-lg text-gray-100 leading-relaxed">
                         {currentStep === 'listening' && transcript ? `"${transcript}"` : 
                          currentStep === 'listening' ? "Silakan bicara sekarang..." :
                          swapersFeedback || "Menunggu sistem..."}
                     </p>
                </div>
            </div>

            {/* Right: User Camera (Candidate) */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 group">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />
                
                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm flex items-center gap-2 backdrop-blur-sm">
                    <Video className="w-3 h-3 text-green-400" />
                    {candidateName} (Anda)
                </div>

                {!hasPermission && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {/* Initial Overlay */}
                {currentStep === 'permission' && hasPermission && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm">
                         <Bot className="w-12 h-12 text-indigo-400 mb-4" />
                         <h2 className="text-2xl font-bold text-white mb-2">Siap Wawancara?</h2>
                         <p className="text-gray-300 mb-6 max-w-xs">
                             Sistem akan merekam suara dan video Anda. Pastikan koneksi internet stabil.
                         </p>
                         <button 
                            onClick={startInterview}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 transition transform hover:scale-105"
                         >
                             Mulai Sesi Bersama Swapers
                         </button>
                    </div>
                )}
            </div>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'permission' && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-800">
                <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                    style={{ width: `${(questionIndex / questions.length) * 100}%` }}
                ></div>
            </div>
        )}
    </div>
  );
};

export default SwapersInterview;
