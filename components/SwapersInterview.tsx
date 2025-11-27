
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Video, AlertCircle, Bot, Volume2, Loader2, Check, X, MicOff, RefreshCcw } from 'lucide-react';
import { validateVoiceAnswer } from '../services/geminiService';
import { QnA } from '../types';

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
  onComplete: (data: QnA[]) => void; // Updated signature to return data
}

const SwapersInterview: React.FC<SwapersInterviewProps> = ({ candidateName, questions, onComplete }) => {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState<'permission' | 'intro' | 'question' | 'listening' | 'processing' | 'speaking' | 'completed'>('permission');
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // Data Collection
  const [interviewData, setInterviewData] = useState<QnA[]>([]);

  // Speech Data
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState(''); 
  const [swapersFeedback, setSwapersFeedback] = useState('');
  
  // Hardware & System State
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // --- Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  
  // Flag to prevent auto-restart when we intentionally stop
  const isIntentionalStop = useRef(false);

  // 1. Initialization: Check Browser & Load Voices
  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
        setIsBrowserSupported(false);
        return;
    }

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, 
            audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera Error:", err);
        setCameraError(true);
      }
    };
    initCamera();

    const loadVoices = () => {
         const voices = synthRef.current.getVoices();
         if (voices.length > 0) {
             setVoicesLoaded(true);
         }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
       if (videoRef.current && videoRef.current.srcObject) {
           const stream = videoRef.current.srcObject as MediaStream;
           stream.getTracks().forEach(t => t.stop());
       }
       if (synthRef.current) synthRef.current.cancel();
       if (recognitionRef.current) {
           isIntentionalStop.current = true;
           recognitionRef.current.stop();
       }
    };
  }, []);

  // 2. Speech Recognition Setup
  useEffect(() => {
    if (!isBrowserSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true; 
    recognition.interimResults = true;
    recognition.lang = 'id-ID'; 

    recognition.onresult = (event: any) => {
      let finalTxt = '';
      let interimTxt = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTxt += event.results[i][0].transcript;
        } else {
          interimTxt += event.results[i][0].transcript;
        }
      }
      
      setTranscript(finalTxt);
      setInterimTranscript(interimTxt);
      
      if (transcriptContainerRef.current) {
          transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech Recognition Error:", event.error);
      if (event.error === 'not-allowed') {
          alert("Akses mikrofon ditolak. Mohon izinkan di pengaturan browser.");
      }
    };

    recognition.onend = () => {
        if (currentStep === 'listening' && !isIntentionalStop.current) {
            try {
                recognition.start();
            } catch(e) {
                console.error("Failed to restart recognition", e);
            }
        }
    };

    recognitionRef.current = recognition;
  }, [isBrowserSupported, currentStep]);

  // 3. TTS Engine
  const speak = (text: string, onEndCallback?: () => void) => {
    if (!text) {
        if (onEndCallback) onEndCallback();
        return;
    }

    isIntentionalStop.current = true;
    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    setCurrentStep('speaking');
    setSwapersFeedback(text);
    
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.1; 
    
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.name.includes('Google Bahasa Indonesia')) || voices.find(v => v.lang.includes('id'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onend = () => {
      if (onEndCallback) {
          setTimeout(onEndCallback, 300);
      }
    };

    utterance.onerror = (e) => {
        console.error("TTS Error", e);
        if (onEndCallback) onEndCallback();
    };

    synthRef.current.speak(utterance);
  };

  // 4. Flow Control
  const startInterview = () => {
    setCurrentStep('intro');
    setTranscript('');
    setInterimTranscript('');
    
    const greeting = `Halo ${candidateName}. Saya Swapers, asisten rekrutmen AI. Santai saja, jawab pertanyaan dengan jelas. Mari kita mulai.`;
    speak(greeting, () => {
        nextQuestion();
    });
  };

  const nextQuestion = () => {
    if (questionIndex >= questions.length) {
      finishInterview();
      return;
    }

    const q = questions[questionIndex];
    setCurrentStep('question');
    speak(q, () => {
        startListening();
    });
  };

  const finishInterview = () => {
      setCurrentStep('completed');
      speak("Terima kasih. Sesi interview selesai. Jawaban Anda telah kami rekam untuk direview oleh tim HR. Semoga sukses!", () => {
          // Send back all collected data
          onComplete(interviewData); 
      });
  };

  const startListening = () => {
    setCurrentStep('listening');
    setTranscript(''); 
    setInterimTranscript('');
    
    isIntentionalStop.current = false;
    try {
        setTimeout(() => {
            recognitionRef.current.start();
        }, 100);
    } catch(e) {
        console.log("Recognition likely already started");
    }
  };

  const handleManualSubmit = async () => {
    const fullAnswer = (transcript + ' ' + interimTranscript).trim();

    if (!fullAnswer || fullAnswer.length < 5) {
        alert("Jawaban terlalu singkat atau tidak terdeteksi. Mohon ulangi.");
        return;
    }

    isIntentionalStop.current = true;
    if (recognitionRef.current) recognitionRef.current.stop();
    
    setCurrentStep('processing');
    
    await new Promise(r => setTimeout(r, 800));

    try {
        const currentQ = questions[questionIndex];
        const validation = await validateVoiceAnswer(fullAnswer, currentQ);

        if (validation.isValid) {
            // Save Data
            setInterviewData(prev => [
                ...prev, 
                { question: currentQ, answer: fullAnswer, aiFeedback: validation.feedback }
            ]);

            speak(validation.feedback, () => {
                setQuestionIndex(prev => prev + 1);
                setTimeout(() => nextQuestion(), 500); 
            });
        } else {
            speak(validation.feedback, () => {
                startListening(); 
            });
        }
    } catch (err) {
        console.error("AI Validation Error", err);
        // Save what we have even if validation fails
        setInterviewData(prev => [
             ...prev, 
             { question: questions[questionIndex], answer: fullAnswer, aiFeedback: "Error validation" }
        ]);
        speak("Terima kasih. Mari lanjut ke pertanyaan berikutnya.", () => {
            setQuestionIndex(prev => prev + 1);
            nextQuestion();
        });
    }
  };

  // --- RENDER ---

  if (!isBrowserSupported) {
      return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white p-6 text-center z-[100]">
            <div className="max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Browser Tidak Didukung</h3>
                <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                    Fitur Wawancara Suara membutuhkan teknologi <strong>Web Speech API</strong>. 
                    Mohon gunakan browser <strong>Google Chrome</strong> (Desktop/Android) atau Microsoft Edge terbaru.
                </p>
                <button onClick={() => onComplete([])} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition w-full">
                    Kembali ke Dashboard
                </button>
            </div>
        </div>
      );
  }

  if (cameraError) {
      return (
          <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white p-6 text-center z-[100]">
              <div className="max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
                  <Video className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-4">Akses Kamera Ditolak</h3>
                  <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                      Untuk keperluan validasi (Proctoring), kami membutuhkan akses ke Kamera dan Mikrofon Anda. 
                      Silakan refresh halaman dan pilih "Allow/Izinkan".
                  </p>
                  <button onClick={() => window.location.reload()} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition w-full flex items-center justify-center gap-2">
                      <RefreshCcw className="w-4 h-4" /> Refresh Halaman
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-[90] overflow-hidden">
        
        {/* 1. HEADER */}
        <div className="flex-none h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex justify-between items-center px-4 sm:px-6 z-20">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                    <span className="text-red-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Live Proctoring</span>
                </div>
            </div>
            
            <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === questionIndex ? 'bg-indigo-500 w-6' : 
                            idx < questionIndex ? 'bg-green-500' : 'bg-slate-700'
                        }`}
                    />
                ))}
            </div>

            <button onClick={() => onComplete([])} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* 2. MAIN CONTENT */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* AI AVATAR */}
            <div className="flex-[1] lg:flex-[1] bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className={`relative z-10 transition-all duration-500 ${currentStep === 'speaking' ? 'scale-110' : 'scale-100'}`}>
                    {(currentStep === 'speaking' || currentStep === 'intro' || currentStep === 'question') && (
                        <>
                            <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping-slow"></div>
                            <div className="absolute -inset-4 rounded-full border border-violet-500/20 animate-ping-slower"></div>
                        </>
                    )}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)] border-4 border-slate-800 relative group">
                        {currentStep === 'processing' ? (
                            <Loader2 className="w-16 h-16 text-white/90 animate-spin" />
                        ) : (
                            <Bot className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 text-white drop-shadow-lg" />
                        )}
                        <div className="absolute -bottom-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-[10px] font-bold text-white uppercase tracking-widest shadow-sm">
                             {currentStep === 'listening' ? 'Mendengarkan' : 'Berbicara'}
                        </div>
                    </div>
                </div>
                <div className="mt-8 w-full max-w-md relative z-10">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-5 rounded-2xl text-center shadow-xl">
                         <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
                             {currentStep === 'listening' ? (
                                 <span className="text-slate-400 italic animate-pulse">"Saya mendengarkan jawaban Anda..."</span>
                             ) : (
                                 swapersFeedback || "Menyiapkan pertanyaan..."
                             )}
                         </p>
                    </div>
                </div>
            </div>

            {/* USER AREA */}
            <div className="flex-[1.2] lg:flex-[1.5] bg-black relative flex flex-col">
                <div className="flex-1 relative overflow-hidden bg-slate-900">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90" 
                    />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-white text-xs font-medium">{candidateName}</span>
                    </div>
                </div>

                {/* CONTROL PANEL */}
                <div className="bg-slate-900 border-t border-slate-800 flex flex-col">
                    <div className="h-32 sm:h-40 overflow-y-auto p-4 border-b border-slate-800 bg-slate-950/50 custom-scrollbar" ref={transcriptContainerRef}>
                        <div className="max-w-3xl mx-auto">
                            {transcript || interimTranscript ? (
                                <p className="text-base sm:text-lg text-white leading-relaxed">
                                    {transcript} <span className="text-slate-500">{interimTranscript}</span>
                                </p>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-600 gap-2">
                                    <MicOff className="w-4 h-4" />
                                    <span className="text-sm">Menunggu input suara...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 flex justify-center items-center gap-4 bg-slate-900">
                        {currentStep === 'permission' ? (
                             <button 
                                onClick={startInterview}
                                disabled={!hasPermission}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105 flex items-center gap-3"
                              >
                                  <Bot className="w-6 h-6" />
                                  {hasPermission ? "Mulai Interview" : "Menunggu Kamera..."}
                              </button>
                        ) : currentStep === 'listening' ? (
                             <div className="flex items-center gap-4 w-full max-w-md">
                                 <button 
                                     onClick={() => {
                                        setTranscript('');
                                        setInterimTranscript('');
                                     }}
                                     className="p-4 rounded-2xl border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                                     title="Reset Jawaban"
                                 >
                                     <RefreshCcw className="w-6 h-6" />
                                 </button>
                                 
                                 <button 
                                     onClick={handleManualSubmit}
                                     className="flex-1 bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-3 animate-pulse-subtle"
                                 >
                                     <div className="p-1 bg-white/20 rounded-full">
                                        <Check className="w-4 h-4" />
                                     </div>
                                     Selesai Bicara
                                 </button>
                             </div>
                         ) : (
                             <div className="text-slate-500 text-sm font-medium flex items-center gap-2 py-2">
                                 {currentStep === 'processing' ? (
                                     <><Loader2 className="w-4 h-4 animate-spin" /> Memproses jawaban...</>
                                 ) : (
                                     <><Volume2 className="w-4 h-4 animate-pulse" /> Jangan bicara dulu...</>
                                 )}
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SwapersInterview;
