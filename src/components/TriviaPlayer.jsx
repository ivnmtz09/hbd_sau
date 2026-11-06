import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Flame, 
  Crown,
  Heart,
  MessageSquare
} from 'lucide-react';
import { fetchTriviaQuestions } from '../services/triviaService';
import { triggerBirthdayBlast, triggerAnimeVictory } from '../utils/confetti';

const TriviaPlayer = ({ onGoToWishes, onSwitchToStudio }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const data = await fetchTriviaQuestions();
      setQuestions(data);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      triggerBirthdayBlast();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      triggerAnimeVictory();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-indigo-500/20 border-2 border-indigo-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Sparkles className="text-indigo-400" size={32} />
        </div>
        <p className="text-white font-black text-xl tracking-wide">Cargando Trivia de Saudí...</p>
        <p className="text-slate-400 text-xs mt-1">Preparando preguntas creadas con cariño</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 border-3 border-slate-800 rounded-3xl text-center">
        <p className="text-slate-300 font-bold mb-4">No hay preguntas de trivia disponibles.</p>
        <button
          onClick={onSwitchToStudio}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl"
        >
          Crear preguntas en Studio
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);

  // Pantalla de Resultados
  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    let title = "Amigo en Fase de Prueba";
    let message = "Mmm... Parece que necesitas ver más Betty la Fea y escuchar más One Direction con Saudí.";
    let badgeColor = "bg-rose-500 text-white";

    if (percentage === 100) {
      title = "Hokage Supremo de la Amistad";
      message = "¡Increíble! Conoces a Saudí al 100%. Te has ganado un lugar VIP en su corazón y en la fiesta.";
      badgeColor = "bg-yellow-400 text-slate-950";
    } else if (percentage >= 70) {
      title = "Pana de Oro Certificado";
      message = "¡Muy bien! Se nota que prestas atención a sus gustos, anécdotas y ocurrencias.";
      badgeColor = "bg-emerald-400 text-slate-950";
    } else if (percentage >= 40) {
      title = "Buen Compañero de Aventuras";
      message = "Nada mal, pero seguro hay historias y anécdotas que todavía tienen pendientes por crear.";
      badgeColor = "bg-indigo-400 text-slate-950";
    }

    return (
      <div className="max-w-xl mx-auto my-8 p-6 sm:p-10 bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl shadow-clay-card text-center animate-scale-in">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-clay-yellow transform -rotate-3 hover:rotate-0 transition-transform">
          <Trophy className="text-slate-950" size={42} />
        </div>

        <div className={`inline-block px-4 py-1.5 font-black text-xs uppercase tracking-wider rounded-full shadow-clay-badge mb-4 ${badgeColor}`}>
          {title}
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {score} de {questions.length} Aciertos
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-2xl shadow-clay-btn active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <RotateCcw size={18} /> Jugar de Nuevo
          </button>

          <button
            onClick={onGoToWishes}
            className="px-6 py-3.5 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-black rounded-2xl shadow-clay-pink active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} /> Dejarle un Deseo a Saudí
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-1">
          <span>¿Eres Saudith?</span>
          <button
            onClick={onSwitchToStudio}
            className="text-pink-400 hover:underline font-bold flex items-center gap-1"
          >
            <Crown size={12} /> Gestionar tus preguntas en Studio
          </button>
        </div>
      </div>
    );
  }

  // Interfaz de Pregunta Activa
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-32">
      {/* Header de la Pregunta / Scoreboard Claymorphic */}
      <div className="bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-clay-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-clay-pink">
            STAGE {currentIndex + 1}/{questions.length}
          </div>
          <span className="text-xs font-mono text-indigo-300 font-bold hidden sm:inline">
            Trivia Oficial Saudí 🎂
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 px-3.5 py-1 rounded-full text-yellow-300 font-mono text-xs font-bold shadow-clay-badge">
            <Flame size={14} className="text-yellow-400" />
            <span>Puntos: {score}</span>
          </div>

          <button
            onClick={onSwitchToStudio}
            className="w-9 h-9 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-pink-400 rounded-full shadow-clay-btn transition-colors"
            title="Módulo de Creadora (Saudí)"
          >
            <Crown size={16} />
          </button>
        </div>
      </div>

      {/* Barra de Progreso Tipo Clay Tube */}
      <div className="w-full bg-slate-950/80 border border-white/10 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Tarjeta de Pregunta Claymorphic */}
      <div className="relative bg-slate-900/85 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-clay-card">
        {/* Badge Flotante */}
        <div className="absolute -top-3.5 left-6 px-3.5 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono text-[11px] font-black uppercase rounded-full shadow-clay-indigo">
          Pregunta #{currentIndex + 1}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2 mb-6 leading-snug">
          {currentQ.question}
        </h3>

        {/* Opciones */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQ.correctIndex;
            let optionStyle = "bg-slate-950/60 border-slate-800 hover:border-indigo-400 text-slate-200";

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = "bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-neo-sm";
              } else if (isSelected) {
                optionStyle = "bg-rose-950/50 border-rose-400 text-rose-200 shadow-neo-sm";
              } else {
                optionStyle = "bg-slate-950/30 border-slate-900 text-slate-600 opacity-60";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-3 transition-all ${optionStyle} ${
                  !isAnswered ? 'hover:scale-[1.01] active:translate-x-0.5 active:translate-y-0.5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0 border ${
                    isSelected ? 'bg-indigo-500 text-white border-black' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />}
                    {isSelected && !isCorrect && <XCircle className="text-rose-400 shrink-0" size={20} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Comentario de Saudí tras responder */}
        {isAnswered && (
          <div className="mt-6 pt-5 border-t border-slate-800 animate-slide-up">
            <div className={`p-4 rounded-2xl border-2 ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-black text-xs uppercase mb-1">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-emerald-400">¡Correcto! ¡Sugoiii!</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-rose-400" />
                    <span className="text-rose-400">¡Fallo!</span>
                  </>
                )}
              </div>

              {currentQ.commentary ? (
                <p className="text-xs sm:text-sm text-slate-200 italic">
                  "{currentQ.commentary}"
                </p>
              ) : (
                <p className="text-xs text-slate-300">
                  La respuesta correcta era: <strong>{currentQ.options[currentQ.correctIndex]}</strong>
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm rounded-xl border-2 border-black shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>{currentIndex + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaPlayer;
