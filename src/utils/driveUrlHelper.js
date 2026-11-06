/**
 * Utilidad para normalizar y convertir enlaces de Google Drive, Google Photos
 * y servicios de almacenamiento en URLs directas optimizadas para la web.
 */

const DRIVE_FILE_REGEX = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([\w-]+)/;

/**
 * Extrae el ID de archivo de un enlace de Google Drive.
 */
export const extractDriveFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(DRIVE_FILE_REGEX);
  return match ? match[1] : null;
};

/**
 * Transforma un enlace de Google Drive o URL general en una URL optimizada.
 * @param {string} rawUrl - Enlace ingresado por el usuario
 * @param {'image' | 'video' | 'auto'} type - Tipo de medio
 */
export const normalizeMediaUrl = (rawUrl, type = 'auto') => {
  if (!rawUrl || typeof rawUrl !== 'string') return { url: '', type: 'image' };

  const trimmed = rawUrl.trim();
  const driveId = extractDriveFileId(trimmed);

  // Detección automática del tipo si no está especificado
  let determinedType = type;
  if (determinedType === 'auto') {
    if (/\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(trimmed) || trimmed.includes('/preview')) {
      determinedType = 'video';
    } else {
      determinedType = 'image';
    }
  }

  // 1. Caso Google Drive
  if (driveId) {
    if (determinedType === 'video') {
      return {
        url: `https://drive.google.com/file/d/${driveId}/preview`,
        thumbnail: `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`,
        type: 'video',
        isDrive: true,
        driveId
      };
    }
    // Imagen Google Drive con CDN de Google (ultra rápido)
    return {
      url: `https://lh3.googleusercontent.com/d/${driveId}`,
      thumbnail: `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`,
      type: 'image',
      isDrive: true,
      driveId
    };
  }

  // 2. Caso Google Photos (URL directa de imagen de álbum)
  if (trimmed.includes('googleusercontent.com') || trimmed.includes('photos.fife.usercontent.google.com')) {
    return {
      url: trimmed,
      thumbnail: trimmed,
      type: determinedType,
      isGooglePhotos: true
    };
  }

  // 3. Caso URL web directa estándar o archivo local
  return {
    url: trimmed,
    thumbnail: trimmed,
    type: determinedType
  };
};

/**
 * Parsea múltiples líneas de texto para extraer enlaces en bloque.
 * @param {string} text - Texto multilínea con enlaces
 * @param {'image' | 'video'} defaultType - Tipo predeterminado
 */
export const parseBulkMediaUrls = (text, defaultType = 'image') => {
  if (!text) return [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  return lines.map((line, idx) => {
    // Si la línea tiene formato: URL | Título
    const parts = line.split('|').map(p => p.trim());
    const url = parts[0];
    const title = parts[1] || '';

    const normalized = normalizeMediaUrl(url, defaultType);
    return {
      id: `remote_${Date.now()}_${idx}`,
      url: normalized.url,
      thumbnail: normalized.thumbnail || normalized.url,
      type: normalized.type,
      title: title || `Recuerdo ${idx + 1}`,
      source: normalized.isDrive ? 'Google Drive' : normalized.isGooglePhotos ? 'Google Photos' : 'Web'
    };
  });
};
