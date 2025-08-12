// Configuraciones específicas para dispositivos móviles
export const isMobile = () => {
  if (typeof window === 'undefined') return false
  
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export const isIOS = () => {
  if (typeof window === 'undefined') return false
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export const isAndroid = () => {
  if (typeof window === 'undefined') return false
  
  return /Android/.test(navigator.userAgent)
}

// Configuraciones de speech recognition para móviles
export const getMobileSpeechConfig = () => {
  if (isMobile()) {
    return {
      continuous: false,        // Mejor compatibilidad en móviles
      interimResults: false,    // Resultados más estables
      maxAlternatives: 1,       // Una sola alternativa para mejor rendimiento
      lang: 'es-ES',           // Idioma español
      grammars: null,           // Sin gramáticas para mejor compatibilidad
      serviceURI: null          // Sin servicio URI específico
    }
  }
  
  // Configuración para desktop
  return {
    continuous: true,
    interimResults: true,
    maxAlternatives: 3,
    lang: 'es-ES',
    grammars: null,
    serviceURI: null
  }
}

// Palabras clave para detectar "pasapalabra"
export const PASAPALABRA_KEYWORDS = [
  'pasapalabra',
  'pasa palabra',
  'pasa la palabra',
  'pasar palabra',
  'pasapalabras',
  'pasa palabras',
  'pasar palabras',
  'saltar',
  'siguiente',
  'pasar',
  'skip',
  'next'
]

// Función para detectar si el texto contiene palabras clave de pasapalabra
export const detectPasapalabra = (text: string): boolean => {
  const normalizedText = text.toLowerCase().trim()
  return PASAPALABRA_KEYWORDS.some(keyword => 
    normalizedText.includes(keyword)
  )
}

// Configuraciones de UI para móviles
export const getMobileUIConfig = () => {
  if (isMobile()) {
    return {
      buttonSize: 'large',      // Botones más grandes para móviles
      fontSize: 'medium',       // Texto mediano para mejor legibilidad
      spacing: 'compact',       // Espaciado compacto
      showHints: true,          // Mostrar pistas para móviles
      autoFocus: false          // No auto-focus en móviles
    }
  }
  
  return {
    buttonSize: 'medium',
    fontSize: 'normal',
    spacing: 'normal',
    showHints: false,
    autoFocus: true
  }
}
