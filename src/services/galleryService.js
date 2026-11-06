import { collection, doc, getDocs, setDoc, deleteDoc, query } from 'firebase/firestore';
import { db, isConfigured } from '../firebase';
import { normalizeMediaUrl } from '../utils/driveUrlHelper';

const LOCAL_STORAGE_KEY = 'hbd_sau_gallery_memories_v2';

// Catálogo base inicial (192 fotos y 30 videos locales o plantilla de migración)
export const DEFAULT_LOCAL_MEMORIES = [
  ...Array.from({ length: 192 }, (_, i) => ({
    id: `local_img_${i + 1}`,
    type: 'image',
    url: `/fotos/foto_ (${i + 1}).jpg`,
    thumbnail: `/fotos/foto_ (${i + 1}).jpg`,
    title: `Foto #${i + 1}`
  })),
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `local_vid_${i + 1}`,
    type: 'video',
    url: `/fotos/video_ (${i + 1}).mp4`,
    thumbnail: `/fotos/foto_ (${(i % 192) + 1}).jpg`,
    title: `Video #${i + 1}`
  }))
];

/**
 * Obtiene todos los recuerdos de la galería.
 * Prioriza Firebase Firestore (colección "gallery_items").
 * Si no hay o falla, lee de LocalStorage; si está vacío, usa el catálogo inicial.
 */
export const fetchMemories = async () => {
  // 1. Intentar desde Firestore
  try {
    if (isConfigured && db) {
      const q = query(collection(db, "gallery_items"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loaded));
        return loaded;
      }
    }
  } catch (error) {
    console.warn("No se pudo cargar galería de Firestore, usando caché local:", error);
  }

  // 2. Intentar desde LocalStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error("Error parseando recuerdos locales:", e);
    }
  }

  // 3. Fallback a catálogo inicial
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LOCAL_MEMORIES));
  return DEFAULT_LOCAL_MEMORIES;
};

/**
 * Agrega un nuevo recuerdo individual (Google Drive, Google Photos o web).
 */
export const addMemoryItem = async ({ rawUrl, type = 'auto', title = '', caption = '' }) => {
  const normalized = normalizeMediaUrl(rawUrl, type);
  const id = `mem_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newItem = {
    id,
    url: normalized.url,
    thumbnail: normalized.thumbnail || normalized.url,
    type: normalized.type,
    title: title.trim() || `Recuerdo ${new Date().toLocaleDateString()}`,
    caption: caption.trim() || '',
    isDrive: Boolean(normalized.isDrive),
    createdAt: new Date().toISOString()
  };

  // Guardar en Firestore
  try {
    if (isConfigured && db) {
      await setDoc(doc(db, "gallery_items", id), newItem);
    }
  } catch (err) {
    console.warn("No se pudo guardar recuerdo en Firestore:", err);
  }

  // Guardar en LocalStorage
  const current = await fetchMemories();
  const updated = [newItem, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Agrega una lista de recuerdos en bloque (ej. múltiples enlaces de Drive).
 */
export const addBatchMemories = async (batchItems) => {
  if (!Array.isArray(batchItems) || batchItems.length === 0) return [];

  // Guardar en Firestore en paralelo
  if (isConfigured && db) {
    const promises = batchItems.map(item => 
      setDoc(doc(db, "gallery_items", item.id), item).catch(err => {
        console.warn("Error guardando item en batch Firestore:", err);
      })
    );
    await Promise.all(promises);
  }

  // Guardar en LocalStorage
  const current = await fetchMemories();
  const updated = [...batchItems, ...current];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Elimina un recuerdo por ID.
 */
export const deleteMemoryItem = async (id) => {
  try {
    if (isConfigured && db && !id.startsWith('local_')) {
      await deleteDoc(doc(db, "gallery_items", id));
    }
  } catch (err) {
    console.warn("No se pudo eliminar recuerdo de Firestore:", err);
  }

  const current = await fetchMemories();
  const filtered = current.filter(m => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Restaura la galería a su estado por defecto.
 */
export const resetMemoriesToDefault = async () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LOCAL_MEMORIES));
  return DEFAULT_LOCAL_MEMORIES;
};
