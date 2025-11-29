import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, User, Loader2 } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const MemoryWall = () => {
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Usamos una colección llamada 'wishes' en Firestore
    useEffect(() => {
        const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
        return onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMsg.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "wishes"), {
                text: newMsg,
                author: name || 'Anónimo',
                timestamp: serverTimestamp()
            });
            setNewMsg('');
        } catch (error) {
            console.error("Error enviando:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-32">
            {/* Formulario de envío */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h3 className="flex items-center gap-3 text-xl font-bold mb-6 text-white">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <MessageSquare size={20} />
                        </div>
                        Deja tu mensaje
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative group/input">
                            <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" size={18} />
                            <input
                                value={name} onChange={e => setName(e.target.value)}
                                placeholder="Tu nombre (Opcional)"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-300"
                            />
                        </div>
                        <textarea
                            value={newMsg} onChange={e => setNewMsg(e.target.value)}
                            placeholder="Escribe un recuerdo o felicitación..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 h-32 resize-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-300"
                        />
                        <button
                            type="submit"
                            disabled={!newMsg.trim() || isSubmitting}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            {isSubmitting ? 'Enviando...' : 'Publicar Mensaje'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Lista de mensajes */}
            <div className="space-y-6">
                {messages.length === 0 ? (
                    <div className="text-center py-16 px-4 rounded-2xl bg-white/5 border border-white/5 border-dashed">
                        <MessageSquare size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-400 text-lg">Aún no hay mensajes.</p>
                        <p className="text-slate-500 text-sm">¡Sé el primero en dejar un bonito recuerdo!</p>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className="relative group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <p className="text-slate-200 mb-4 leading-relaxed text-base md:text-lg font-light">"{msg.text}"</p>

                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4 mt-2">
                                <div className="flex items-center gap-2 font-bold text-indigo-300">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <User size={12} />
                                    </div>
                                    <span>{msg.author}</span>
                                </div>
                                {/* Formateo simple de fecha si existe timestamp */}
                                {msg.timestamp && (
                                    <span className="opacity-50 font-mono">
                                        {new Date(msg.timestamp.seconds * 1000).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemoryWall;