import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Crown, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Gamepad2,
  AlertCircle,
  Image as ImageIcon,
  Cloud,
  Layers,
  Upload,
  Link as LinkIcon,
  Video
} from 'lucide-react';
import { 
  fetchTriviaQuestions, 
  saveTriviaQuestion, 
  deleteTriviaQuestion, 
  resetTriviaToDefault 
} from '../services/triviaService';
import { 
  fetchMemories, 
  addMemoryItem, 
  addBatchMemories, 
  deleteMemoryItem, 
  resetMemoriesToDefault 
} from '../services/galleryService';
import { normalizeMediaUrl, parseBulkMediaUrls } from '../utils/driveUrlHelper';
import { triggerAnimeVictory, triggerBirthdayBlast } from '../utils/confetti';

const DEFAULT_PIN = "saudiki123.";

const TriviaStudio = ({ onSwitchToPlayer }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('sau_studio_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [studioTab, setStudioTab] = useState('trivia'); // 'trivia' | 'gallery'
  
  // --- Estado de Trivia ---
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    id: null,
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    commentary: ''
  });

  // --- Estado de Galería ---
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [galleryMode, setGalleryMode] = useState('single'); // 'single' | 'bulk'
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState('auto');
  const [bulkText, setBulkText] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);

  // Carga de datos de Trivia
  const loadTriviaData = async () => {
    setLoadingQuestions(true);
    const data = await fetchTriviaQuestions();
    setQuestions(data);
    setLoadingQuestions(false);
  };

  // Carga de datos de Galería
  const loadGalleryData = async () => {
    setLoadingMemories(true);
    const data = await fetchMemories();
    setMemories(data);
    setLoadingMemories(false);
  };

  useEffect(() => {
    let mounted = true;
    if (isAuthenticated) {
      fetchTriviaQuestions().then((data) => {
        if (mounted) {
          setQuestions(data);
          setLoadingQuestions(false);
        }
      });
      fetchMemories().then((data) => {
        if (mounted) {
          setMemories(data);
          setLoadingMemories(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const pin = pinInput.trim();
    if (pin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sau_studio_auth', 'true');
      setPinError('');
      triggerBirthdayBlast();
    } else {
      setPinError('Clave incorrecta. Acceso restringido.');
    }
  };

  // --- Handlers de Trivia ---
  const handleEditQuestion = (q) => {
    setCurrentQuestion({
      id: q.id,
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      commentary: q.commentary || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!currentQuestion.question.trim()) return;
    if (currentQuestion.options.some(opt => !opt.trim())) {
      alert("Por favor llena las 4 opciones de respuesta.");
      return;
    }

    await saveTriviaQuestion(currentQuestion);
    triggerAnimeVictory();
    setIsEditing(false);
    setCurrentQuestion({
      id: null,
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      commentary: ''
    });
    await loadTriviaData();
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("¿Segura que deseas borrar esta pregunta?")) {
      await deleteTriviaQuestion(id);
      await loadTriviaData();
    }
  };

  const handleResetTrivia = async () => {
    if (window.confirm("¿Restaurar las preguntas sugeridas iniciales?")) {
      await resetTriviaToDefault();
      await loadTriviaData();
    }
  };

  // --- Handlers de Galería / Google Drive ---
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setNewMediaUrl(val);
    if (val.trim()) {
      const normalized = normalizeMediaUrl(val, newMediaType);
      setPreviewMedia(normalized);
    } else {
      setPreviewMedia(null);
    }
  };

  const handleAddSingleMemory = async (e) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;

    await addMemoryItem({
      rawUrl: newMediaUrl,
      type: newMediaType,
      title: newMediaTitle
    });

    triggerAnimeVictory();
    setNewMediaUrl('');
    setNewMediaTitle('');
    setPreviewMedia(null);
    await loadGalleryData();
  };

  const handleAddBulkMemories = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const parsedItems = parseBulkMediaUrls(bulkText, newMediaType === 'auto' ? 'image' : newMediaType);
    if (parsedItems.length === 0) {
      alert("No se detectaron enlaces válidos.");
      return;
    }

    await addBatchMemories(parsedItems);
    triggerBirthdayBlast();
    setBulkText('');
    await loadGalleryData();
    alert(`¡Se importaron ${parsedItems.length} recuerdos exitosamente!`);
  };

  const handleDeleteMemory = async (id) => {
    if (window.confirm("¿Eliminar este recuerdo de la galería?")) {
      await deleteMemoryItem(id);
      await loadGalleryData();
    }
  };

  const handleResetGallery = async () => {
    if (window.confirm("¿Restaurar la galería a los recuerdos iniciales?")) {
      await resetMemoriesToDefault();
      await loadGalleryData();
    }
  };

  // Pantalla de Desbloqueo / Role Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl shadow-clay-card text-center animate-scale-in">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-clay-pink">
          <Crown className="text-white" size={32} />
        </div>

        <div className="inline-block px-3.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-clay-yellow mb-4">
          Área Exclusiva
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
          Módulo de Creadora
        </h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Hola Saudith. Desde aquí puedes personalizar la trivia y actualizar la galería con enlaces de Google Drive o fotos sin tocar código.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Clave de Cumpleañera VIP
            </label>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full bg-slate-950/60 border border-white/15 focus:border-pink-400 rounded-2xl py-3.5 px-4 text-white text-center font-mono placeholder:text-slate-600 outline-none transition-all shadow-inner text-lg tracking-widest"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                <AlertCircle size={12} /> {pinError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black tracking-wide rounded-2xl shadow-clay-pink active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Unlock size={18} />
            <span>Acceder como Saudith</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          ¿Quieres jugar primero?{' '}
          <button
            onClick={onSwitchToPlayer}
            className="text-indigo-400 hover:underline font-bold"
          >
            Ir a Jugar Trivia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-32">
      {/* Banner Superior Saudí Studio Claymorphic */}
      <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 p-6 rounded-3xl shadow-clay-card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-clay-yellow mb-2">
              <Crown size={14} /> ROL: CREADORA VIP (SAUDITH)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Saudí Studio 2.0
              <Sparkles className="text-pink-400 animate-spin-slow" size={24} />
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Personaliza la trivia y agrega nuevas fotos/videos desde Google Drive.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onSwitchToPlayer}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs rounded-xl border-2 border-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Gamepad2 size={16} /> Probar Minijuego
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('sau_studio_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border-2 border-slate-700 shadow-neo-sm"
              title="Cerrar sesión de creadora"
            >
              <Lock size={16} />
            </button>
          </div>
        </div>

        {/* Selector de Pestaña interna de Studio */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setStudioTab('trivia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
              studioTab === 'trivia'
                ? 'bg-indigo-500 text-white border-black shadow-neo-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Gamepad2 size={15} />
            <span>Gestionar Trivia ({questions.length})</span>
          </button>

          <button
            onClick={() => setStudioTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${
              studioTab === 'gallery'
                ? 'bg-pink-500 text-white border-black shadow-neo-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Cloud size={15} />
            <span>Gestionar Galería (Drive / Fotos) ({memories.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== PESTAÑA 1: GESTIÓN DE TRIVIA ==================== */}
      {studioTab === 'trivia' && (
        <div className="space-y-8 animate-fade-in">
          {/* Editor de Pregunta */}
          <div className="bg-slate-900/90 border-3 border-slate-800 focus-within:border-indigo-400 rounded-3xl p-6 sm:p-8 shadow-neo-lg transition-colors">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                {isEditing ? <Edit3 className="text-yellow-400" size={20} /> : <PlusCircle className="text-pink-400" size={20} />}
                {isEditing ? 'Editar Pregunta' : 'Crear Nueva Pregunta'}
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentQuestion({
                      id: null,
                      question: '',
                      options: ['', '', '', ''],
                      correctIndex: 0,
                      commentary: ''
                    });
                  }}
                  className="text-xs text-slate-400 hover:text-white underline font-bold"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-indigo-300 mb-2">
                  1. Enunciado de la Pregunta
                </label>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  placeholder="Ej: ¿Qué hago cuando tengo un mal día?"
                  required
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-indigo-400 rounded-xl p-3.5 text-white font-medium placeholder:text-slate-600 outline-none shadow-neo-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-indigo-300 mb-2">
                  2. Opciones de respuesta (Marca el círculo verde en la correcta)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = currentQuestion.correctIndex === index;
                    return (
                      <div
                        key={index}
                        onClick={() => setCurrentQuestion({ ...currentQuestion, correctIndex: index })}
                        className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-400 shadow-neo-sm'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-black shrink-0 border ${
                            isCorrect
                              ? 'bg-emerald-400 text-slate-950 border-black'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>

                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({ ...currentQuestion, options: newOptions });
                          }}
                          placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                          required
                          className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-600 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        />

                        {isCorrect && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full shrink-0">
                            Correcta
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-pink-300 mb-2">
                  3. Comentario o reacción picante de Saudith al responder (Opcional)
                </label>
                <input
                  type="text"
                  value={currentQuestion.commentary}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, commentary: e.target.value })}
                  placeholder="Ej: ¡Ja! Si no sabías esto, devuélveme los regalos."
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-pink-400 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 outline-none shadow-neo-sm transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-black text-sm rounded-xl border-2 border-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>{isEditing ? 'Guardar Cambios' : 'Publicar Pregunta'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Preguntas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Preguntas Activas ({questions.length})
              </h3>
              <button
                onClick={handleResetTrivia}
                className="text-xs text-slate-400 hover:text-yellow-400 font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} /> Restaurar plantilla inicial
              </button>
            </div>

            {loadingQuestions ? (
              <div className="p-8 text-center text-slate-500 font-medium">
                Cargando preguntas de la trivia...
              </div>
            ) : questions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl text-slate-400">
                Aún no has agregado preguntas. ¡Comienza arriba!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {questions.map((q, qIndex) => (
                  <div
                    key={q.id || qIndex}
                    className="bg-slate-900/80 border-2 border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-neo transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-black text-xs flex items-center justify-center">
                          #{qIndex + 1}
                        </span>
                        <h4 className="text-white font-bold text-base leading-snug">
                          {q.question}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleEditQuestion(q)}
                          className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIndex) => {
                        const isCorrect = q.correctIndex === oIndex;
                        return (
                          <div
                            key={oIndex}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 font-bold'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <span className="font-mono font-black">{String.fromCharCode(65 + oIndex)}.</span>
                            <span className="truncate">{opt}</span>
                            {isCorrect && <CheckCircle2 size={14} className="ml-auto text-emerald-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== PESTAÑA 2: GESTIÓN DE GALERÍA (DRIVE / WEB) ==================== */}
      {studioTab === 'gallery' && (
        <div className="space-y-8 animate-fade-in">
          {/* Tarjeta de Agregar Recuerdos */}
          <div className="bg-slate-900/90 border-3 border-pink-500/70 rounded-3xl p-6 sm:p-8 shadow-neo-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Cloud className="text-pink-400" size={20} />
                  Agregar Recuerdos desde Google Drive / Fotos
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pega cualquier enlace público de Google Drive ("Cualquiera con el enlace puede ver") o URL web.
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setGalleryMode('single')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    galleryMode === 'single'
                      ? 'bg-pink-500 text-white shadow-neo-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setGalleryMode('bulk')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    galleryMode === 'bulk'
                      ? 'bg-pink-500 text-white shadow-neo-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  En Lote
                </button>
              </div>
            </div>

            {/* Modo Individual */}
            {galleryMode === 'single' ? (
              <form onSubmit={handleAddSingleMemory} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase text-pink-300 mb-2">
                    Enlace de Google Drive o URL de la foto/video
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-3.5 text-slate-500" size={18} />
                    <input
                      type="url"
                      value={newMediaUrl}
                      onChange={handleUrlChange}
                      placeholder="https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                      required
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-pink-400 rounded-xl py-3 pl-12 pr-4 text-white text-sm placeholder:text-slate-600 outline-none shadow-neo-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                      Título o Anécdota (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      placeholder="Ej: Viaje a la playa 2024"
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-pink-400 rounded-xl p-3 text-white text-sm placeholder:text-slate-600 outline-none shadow-neo-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-400 mb-2">
                      Tipo de Contenido
                    </label>
                    <select
                      value={newMediaType}
                      onChange={(e) => {
                        setNewMediaType(e.target.value);
                        if (newMediaUrl) {
                          setPreviewMedia(normalizeMediaUrl(newMediaUrl, e.target.value));
                        }
                      }}
                      className="w-full bg-slate-950 border-2 border-slate-700 focus:border-pink-400 rounded-xl p-3 text-white text-sm outline-none shadow-neo-sm font-medium"
                    >
                      <option value="auto">Auto-detectar</option>
                      <option value="image">Fotografía</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                {/* Previsualización en vivo */}
                {previewMedia && (
                  <div className="p-4 bg-slate-950 border-2 border-dashed border-indigo-400/60 rounded-2xl flex items-center gap-4 animate-fade-in">
                    <div className="w-20 h-20 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                      {previewMedia.type === 'video' ? (
                        <Video className="text-pink-400" size={28} />
                      ) : (
                        <img
                          src={previewMedia.thumbnail || previewMedia.url}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-400 block">
                        ✓ Enlace procesado correctamente ({previewMedia.isDrive ? 'Google Drive' : 'Web'})
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block max-w-sm">
                        {previewMedia.url}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl border-2 border-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <PlusCircle size={18} />
                    <span>Agregar a la Galería</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Modo en Lote (Bulk) */
              <form onSubmit={handleAddBulkMemories} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-pink-300 mb-2">
                    Pega múltiples enlaces (Uno por línea)
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={6}
                    placeholder="https://drive.google.com/file/d/1A... | Título opcional&#10;https://drive.google.com/file/d/2B... | Con los panas&#10;https://drive.google.com/file/d/3C..."
                    className="w-full bg-slate-950 border-2 border-slate-700 focus:border-pink-400 rounded-xl p-3.5 text-white font-mono text-xs placeholder:text-slate-600 outline-none shadow-neo-sm leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tip: Puedes separar el enlace y el título con una barra vertical (|).
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black text-sm rounded-xl border-2 border-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    <Upload size={18} />
                    <span>Importar Enlaces en Lote</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Lista de Recuerdos en la Galería */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  Recuerdos en la Galería ({memories.length})
                </h3>
                <span className="text-xs text-slate-400">
                  Fotos y videos actualmente visibles para Saudí y amigos.
                </span>
              </div>

              <button
                onClick={handleResetGallery}
                className="text-xs text-slate-400 hover:text-yellow-400 font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} /> Restaurar catálogo inicial
              </button>
            </div>

            {loadingMemories ? (
              <div className="p-8 text-center text-slate-500 font-medium">
                Cargando galería...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                {memories.map((m) => (
                  <div
                    key={m.id}
                    className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square flex items-center justify-center"
                  >
                    {m.type === 'video' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-950">
                        <Video size={20} className="text-yellow-400 mb-1" />
                        <span className="text-[10px] text-slate-300 font-mono truncate w-full">
                          {m.title || 'Video'}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={m.thumbnail || m.url}
                        alt={m.title || "Foto"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* Botón eliminar al hacer hover */}
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-sm"
                      title="Eliminar de galería"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaStudio;
