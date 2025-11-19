
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, User as UserIcon, Settings, MoreVertical } from 'lucide-react';
import { User } from '../types';

interface LiveInterviewProps {
  user: User | null;
  opponentName: string; // Nama lawan bicara (Kandidat atau HR)
  onEndCall: () => void;
}

const LiveInterview: React.FC<LiveInterviewProps> = ({ user, opponentName, onEndCall }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'initializing' | 'connecting' | 'connected'>('initializing');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (!mounted) {
            // Clean up if component unmounted before stream was ready
            stream.getTracks().forEach(track => track.stop());
            return;
        }

        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        
        // Simulasi koneksi
        setTimeout(() => mounted && setConnectionStatus('connecting'), 1000);
        setTimeout(() => mounted && setConnectionStatus('connected'), 3000);

      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (mounted) {
            alert("Mohon izinkan akses Kamera dan Mikrofon untuk memulai interview.");
            onEndCall();
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      // Cleanup: Stop semua track kamera/mic saat komponen di-unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // Empty dependency array to ensure this only runs once on mount, 
    // independent of prop changes like 'onEndCall' identity
  }, []);

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-[60] flex flex-col h-screen w-screen overflow-hidden">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <span className="flex h-3 w-3 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                </span>
            </div>
            <div className="text-white">
                <h3 className="font-bold text-lg shadow-sm">Interview Room: {opponentName}</h3>
                <p className="text-xs text-gray-300 font-mono">
                    {connectionStatus === 'initializing' && 'Memeriksa perangkat...'}
                    {connectionStatus === 'connecting' && 'Menghubungkan enkripsi end-to-end...'}
                    {connectionStatus === 'connected' && '00:02:15 • Encrypted'}
                </p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                <MoreVertical className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Main Video Area (REMOTE / Lawan Bicara) */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
        {connectionStatus === 'connected' ? (
           // Simulasi Video Lawan Bicara (Placeholder profesional)
           <div className="w-full h-full relative overflow-hidden">
               <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80"
                  alt="Remote User"
                  className="w-full h-full object-cover"
               />
               {/* Overlay nama lawan bicara */}
               <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2">
                   <UserIcon className="w-4 h-4" /> {opponentName}
               </div>
           </div>
        ) : (
            // Loading State
            <div className="text-center p-10">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-6"></div>
                <h2 className="text-white text-2xl font-light">Menunggu {opponentName} bergabung...</h2>
                <p className="text-gray-400 mt-2">Sistem sedang melakukan handshake koneksi aman.</p>
            </div>
        )}

        {/* PIP (Picture in Picture) - LOCAL USER / DIRI SENDIRI */}
        <div className="absolute bottom-6 right-6 w-48 h-36 sm:w-64 sm:h-48 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700 transition-all hover:scale-105 cursor-move z-20 group">
             {!hasPermission && (
                 <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xs text-center p-2">
                     Mengakses Kamera...
                 </div>
             )}
             <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted={true} // Explicitly set true to avoid feedback loop
                className={`w-full h-full object-cover transform scale-x-[-1] ${isVideoOff ? 'hidden' : 'block'}`} 
             />
             {isVideoOff && (
                 <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-400">
                     <div className="bg-gray-700 p-3 rounded-full mb-2">
                        <VideoOff className="w-6 h-6" />
                     </div>
                     <span className="text-xs">Kamera Dimatikan</span>
                 </div>
             )}
             <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                 Anda {isMuted && '(Muted)'}
             </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="h-24 bg-gray-900 flex items-center justify-center gap-6 px-4 z-30">
        <button 
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            title={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button 
            onClick={onEndCall}
            className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center gap-2 font-bold transition-all transform hover:scale-105"
        >
            <PhoneOff className="w-6 h-6" />
            <span className="hidden sm:inline">Akhiri Sesi</span>
        </button>

        <button 
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all duration-200 shadow-lg ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
            title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
        >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
        
        <div className="w-px h-10 bg-gray-700 mx-2 hidden sm:block"></div>
        
        <button className="hidden sm:block p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow-lg" title="Share Screen">
            <Monitor className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};

export default LiveInterview;
