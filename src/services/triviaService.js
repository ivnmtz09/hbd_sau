import { collection, doc, getDocs, setDoc, deleteDoc, query } from 'firebase/firestore';
import { db, isConfigured } from '../firebase';
import { DEFAULT_TRIVIA_QUESTIONS } from '../data/defaultTrivia';

const LOCAL_STORAGE_KEY = 'hbd_sau_trivia_questions_v1';

/**
 * Obtiene todas las preguntas de la trivia.
 * Prioriza Firebase Firestore; si falla o está vacío, lee de localStorage o usa el default.
 */
export const fetchTriviaQuestions = async () => {
  try {
    if (isConfigured && db) {
      const q = query(collection(db, "trivia_questions"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Guardar copia local
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loaded));
        return loaded;
      }
    }
  } catch (error) {
    console.warn("No se pudo cargar de Firestore, intentando almacenamiento local:", error);
  }

  // Fallback LocalStorage
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parseando local storage trivia:", e);
    }
  }

  // Fallback por defecto
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TRIVIA_QUESTIONS));
  return DEFAULT_TRIVIA_QUESTIONS;
};

/**
 * Guarda o actualiza una pregunta.
 */
export const saveTriviaQuestion = async (questionData) => {
  const id = questionData.id || `trivia_${Date.now()}`;
  const dataToSave = {
    ...questionData,
    id,
    updatedAt: new Date().toISOString()
  };

  // 1. Guardar en Firestore si es posible
  try {
    if (isConfigured && db) {
      await setDoc(doc(db, "trivia_questions", id), dataToSave);
    }
  } catch (err) {
    console.warn("No se pudo guardar en Firestore:", err);
  }

  // 2. Guardar en LocalStorage
  const current = await fetchTriviaQuestions();
  const index = current.findIndex(q => q.id === id);
  let updatedList;
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = dataToSave;
  } else {
    updatedList = [...current, dataToSave];
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  return updatedList;
};

/**
 * Elimina una pregunta.
 */
export const deleteTriviaQuestion = async (id) => {
  try {
    if (isConfigured && db) {
      await deleteDoc(doc(db, "trivia_questions", id));
    }
  } catch (err) {
    console.warn("No se pudo eliminar de Firestore:", err);
  }

  const current = await fetchTriviaQuestions();
  const filtered = current.filter(q => q.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Restaura las preguntas por defecto.
 */
export const resetTriviaToDefault = async () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_TRIVIA_QUESTIONS));
  return DEFAULT_TRIVIA_QUESTIONS;
};
