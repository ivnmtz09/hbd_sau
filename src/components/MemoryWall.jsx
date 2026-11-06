import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  User, 
  Loader2, 
  Heart, 
  Sparkles, 
  Crown, 
  Flame, 
  Smile, 
  Cake 
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db, isConfigured } from '../firebase';
import { triggerBirthdayBlast, triggerElementPop } from '../utils/confetti';

const FRIENDS_TAGS = [
  { name: "Ivan", color: "bg-indigo-500 text-white" },
  { name: "Julio", color: "bg-emerald-500 text-white" },
  { name: "Hasmith", color: "bg-pink-500 text-white" },
  { name: "Maurith", color: "bg-amber-500 text-slate-950" },
  { name: "Carlos", color: "bg-cyan-500 text-slate-950" },
  { name: "Elisa", color: "bg-purple-500 text-white" },
  { name: "Saudí", color: "bg-yellow-400 text-slate-950" }
];

const EMOJI_REACTIONS = [
  { key: 'heart', label: '❤️' },
  { key: 'cake', label: '🎂' },
  { key: 'laugh', label: '😂' },
  { key: 'cry', label: '🥹' },
  { key: 'crown', label: '👑' }
];

const MemoryWall = () => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fallback local en caso de que Firestore falle o esté en modo offline
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      if (isConfigured && db) {
        const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(docs);
            setLoading(false);
          },
          (error) => {
            console.warn("Firestore listener error, using local fallback:", error);
            loadLocalMessages();
          }
        );
      } else {
        loadLocalMessages();
      }
    } catch (err) {
      console.warn("No se pudo iniciar listener Firestore:", err);
      loadLocalMessages();
    }

    return () => unsubscribe();
  }, []);

  const loadLocalMessages = () => {
    const saved = localStorage.getItem('hbd_sau_wishes_backup');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Error parseando backup de mensajes:", e);
      }
    }
    setLoading(false);
  };

  const saveLocalBackup = (newList) => {
    localStorage.setItem('hbd_sau_wishes_backup', JSON.stringify(newList));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    setIsSubmitting(true);
    const authorName = name.trim() || 'Amigo Anónimo';

    const newEntry = {
      text: newMsg.trim(),
      author: authorName,
      timestamp: serverTimestamp(),
      reactions: { heart: 0, cake: 0, laugh: 0, cry: 0, crown: 0 }
    };

    try {
      if (isConfigured && db) {
        await addDoc(collection(db, "wishes"), newEntry);
      } else {
        // Fallback local
        const localDoc = {
          ...newEntry,
          id: `local_${Date.now()}`,
          timestamp: { seconds: Math.floor(Date.now() / 1000) }
        };
        const updated = [localDoc, ...messages];
        setMessages(updated);
        saveLocalBackup(updated);
      }

      setNewMsg('');
      triggerBirthdayBlast();
    } catch (error) {
      console.error("Error enviando mensaje a Firestore:", error);
      // Fallback local si falla la red
      const localDoc = {
        ...newEntry,
        id: `local_${Date.now()}`,
        timestamp: { seconds: Math.floor(Date.now() / 1000) }
      };
      const updated = [localDoc, ...messages];
      setMessages(updated);
      saveLocalBackup(updated);
      setNewMsg('');
      triggerBirthdayBlast();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (msgId, reactionKey, e) => {
    triggerElementPop(e);

    // Actualización optimista local
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        const reactions = m.reactions || {};
        return {
          ...m,
          reactions: {
            ...reactions,
            [reactionKey]: (reactions[reactionKey] || 0) + 1
          }
        };
      }
      return m;
    });
    setMessages(updated);
    saveLocalBackup(updated);

    // Intentar persistir en Firestore
    try {
      if (isConfigured && db && !msgId.startsWith('local_')) {
        const docRef = doc(db, "wishes", msgId);
        await updateDoc(docRef, {
          [`reactions.${reactionKey}`]: increment(1)
        });
      }
    } catch (err) {
      console.warn("No se pudo actualizar reacción en Firestore:", err);
    }
  };

  const getFriendBadge = (authorName) => {
    const found = FRIENDS_TAGS.find(
      (f) => f.name.toLowerCase() === authorName.trim().toLowerCase()
    );
    if (!found) return null;
    return found;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in pb-32">
      {/* Formulario Claymorphic */}
      <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-clay-card overflow-hidden">
        {/* Etiqueta flotante */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-mono font-black text-xs uppercase tracking-wider rounded-full shadow-clay-badge mb-4">
          <MessageSquare size={13} />
          <span>Muro de Dedicatorias Clay</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-2">
          ¡Déjale un mensaje a Saudith!
          <Cake className="text-yellow-400" size={24} />
        </h3>

        <p className="text-slate-300 text-sm mb-6">
          Un recuerdo, un chiste interno, una felicitación o tus mejores deseos para este nuevo año.
        </p>

        {/* Atajos de autor (Los 6 panas + Saudí) */}
        <div className="mb-5">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Firma rápida:
          </span>
          <div className="flex flex-wrap gap-2">
            {FRIENDS_TAGS.map((friend) => (
              <button
                key={friend.name}
                type="button"
                onClick={() => setName(friend.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shadow-clay-badge active:scale-95 ${
                  name.toLowerCase() === friend.name.toLowerCase()
                    ? `${friend.color} scale-105 ring-2 ring-white/50`
                    : 'bg-slate-950/70 text-slate-300 border border-white/10 hover:border-white/30'
                }`}
              >
                {friend.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre o apodo..."
              maxLength={35}
              className="w-full bg-slate-950/60 border border-white/10 focus:border-pink-400 rounded-2xl py-3 pl-12 pr-4 text-white text-sm placeholder:text-slate-600 outline-none transition-all shadow-inner font-medium"
            />
          </div>

          <div>
            <textarea
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Escribe aquí tu felicitación para Saudí..."
              maxLength={600}
              rows={4}
              className="w-full bg-slate-950/60 border border-white/10 focus:border-pink-400 rounded-2xl p-4 text-white text-sm placeholder:text-slate-600 resize-none outline-none transition-all shadow-inner font-medium leading-relaxed"
            />
            <div className="text-right text-[11px] font-mono text-slate-500 mt-1">
              {newMsg.length}/600 caracteres
            </div>
          </div>

          <button
            type="submit"
            disabled={!newMsg.trim() || isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-clay-pink active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            <span>{isSubmitting ? 'Publicando...' : 'Publicar Deseo con Confeti 🎉'}</span>
          </button>
        </form>
      </div>

      {/* Lista de Mensajes */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            Mensajes de Amigos ({messages.length})
          </h4>
          <span className="text-xs font-mono text-indigo-400 font-bold">
            Actualización en vivo ✨
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Cargando dedicatorias...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900 border-3 border-dashed border-slate-800">
            <MessageSquare size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-300 font-bold text-lg">Aún no hay mensajes.</p>
            <p className="text-slate-500 text-xs mt-1">¡Sé el primero en dejarle unas bonitas palabras!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const badge = getFriendBadge(msg.author || '');
            const reactions = msg.reactions || {};

            return (
              <div
                key={msg.id}
                className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-clay-card hover:shadow-clay-pink transition-all hover:scale-[1.01]"
              >
                {/* Header del Mensaje */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs font-mono shadow-clay-badge">
                      {(msg.author || 'A')[0].toUpperCase()}
                    </div>

                    <div>
                      <span className="text-sm font-black text-white tracking-tight">
                        {msg.author || 'Anónimo'}
                      </span>
                      {badge && (
                        <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-clay-badge ${badge.color}`}>
                          {badge.name === 'Saudí' ? '👑 Cumpleañera' : '✨ Amigo VIP'}
                        </span>
                      )}
                    </div>
                  </div>

                  {msg.timestamp && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {msg.timestamp.seconds
                        ? new Date(msg.timestamp.seconds * 1000).toLocaleDateString()
                        : 'Recién'}
                    </span>
                  )}
                </div>

                {/* Texto del Mensaje */}
                <p className="text-slate-200 text-base leading-relaxed font-normal whitespace-pre-wrap mb-5">
                  "{msg.text}"
                </p>

                {/* Reacciones con Emojis Claymorphic */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-400 mr-1">Reaccionar:</span>
                  {EMOJI_REACTIONS.map(({ key, label }) => {
                    const count = reactions[key] || 0;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={(e) => handleReaction(msg.id, key, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all active:scale-90 ${
                          count > 0
                            ? 'bg-slate-800 border-indigo-400/50 text-white shadow-clay-badge'
                            : 'bg-slate-950/60 border-white/5 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <span className="text-sm">{label}</span>
                        {count > 0 && (
                          <span className="font-mono font-bold text-[11px] text-pink-300">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MemoryWall;
