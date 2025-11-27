
import React, { useState } from 'react';
import { Message, User } from '../types';
import { Send, User as UserIcon, Search, MessageSquare } from 'lucide-react';

// Mock Messages Data
const MOCK_MESSAGES: Message[] = [
    { id: 'm1', senderId: 'user-1', receiverId: 'user-2', text: 'Halo, apakah lamaran saya sudah direview?', timestamp: '09:30', isRead: true, senderName: 'Andi Pratama' },
    { id: 'm2', senderId: 'user-2', receiverId: 'user-1', text: 'Halo Andi, sudah. Kami akan menjadwalkan interview minggu depan.', timestamp: '09:45', isRead: false, senderName: 'HR Manager Tech' },
    { id: 'm3', senderId: 'user-104', receiverId: 'user-2', text: 'Terima kasih atas offeringnya!', timestamp: 'Kemarin', isRead: true, senderName: 'Diana Putri' }
];

interface MessagesProps {
    user: User;
}

const Messages: React.FC<MessagesProps> = ({ user }) => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>('user-1');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

    // Filter conversations (Unique senders)
    const conversations = Array.from(new Set(messages.map(m => m.senderId === user.id ? m.receiverId : m.senderId)))
        .map(id => {
            const lastMsg = messages.filter(m => m.senderId === id || m.receiverId === id).pop();
            const otherUser = lastMsg?.senderId === user.id ? 'Kandidat' : lastMsg?.senderName; // Simplifikasi
            return {
                id,
                name: otherUser || 'Unknown',
                lastMessage: lastMsg?.text,
                time: lastMsg?.timestamp,
                avatar: `https://ui-avatars.com/api/?name=${otherUser}&background=random`
            };
        });

    const currentChatMessages = messages.filter(m => 
        (m.senderId === user.id && m.receiverId === selectedChatId) || 
        (m.senderId === selectedChatId && m.receiverId === user.id)
    );

    const handleSend = () => {
        if (!inputText.trim() || !selectedChatId) return;
        
        const newMsg: Message = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            receiverId: selectedChatId,
            text: inputText,
            timestamp: 'Baru saja',
            isRead: false,
            senderName: user.name
        };
        
        setMessages([...messages, newMsg]);
        setInputText('');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex h-full">
                
                {/* Sidebar List */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pesan Masuk</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Cari percakapan..." 
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(chat => (
                            <div 
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition flex gap-3 ${selectedChatId === chat.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <img src={chat.avatar} className="w-10 h-10 rounded-full bg-gray-300 object-cover" alt="" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm text-gray-900 truncate">{chat.name}</h4>
                                        <span className="text-xs text-gray-400">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedChatId ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Percakapan</h3>
                                        <p className="text-xs text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {currentChatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                                            msg.senderId === user.id 
                                            ? 'bg-indigo-600 text-white rounded-br-none' 
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}>
                                            <p>{msg.text}</p>
                                            <span className={`text-[10px] block mt-1 ${msg.senderId === user.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ketik pesan..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <button 
                                        onClick={handleSend}
                                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-lg"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
                            <p>Pilih percakapan untuk memulai chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
