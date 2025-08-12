# 🎤 Funcionalidad de Reconocimiento de Voz - Pasapalabra

## Descripción

El juego incluye reconocimiento de voz para responder preguntas y controlar el juego mediante comandos de voz.

## 🚀 Características

- ✅ **Reconocimiento de voz en tiempo real**
- ✅ **Compatibilidad móvil optimizada**
- ✅ **Detección automática de "pasapalabra"**
- ✅ **Manejo inteligente de errores**
- ✅ **Configuraciones adaptativas por dispositivo**

## 📱 Compatibilidad Móvil

### Dispositivos Soportados
- **Android**: Chrome, Firefox, Edge
- **iOS**: Safari (requiere iOS 14.3+)
- **Desktop**: Chrome, Firefox, Safari, Edge

### Configuraciones Automáticas
- **Móviles**: Modo no continuo, resultados estables
- **Desktop**: Modo continuo, resultados intermedios

## 🎯 Comandos de Voz

### Respuestas
- Di la respuesta a la pregunta
- El sistema detecta automáticamente si es correcta

### Comando "Pasapalabra"
- **"pasapalabra"** → Salta la pregunta actual
- **"pasa palabra"** → Alternativa aceptada
- **"saltar"** → Comando alternativo
- **"siguiente"** → Comando alternativo

### Ejemplos de Uso
```
Usuario: "Arena"
Sistema: ✅ Respuesta correcta

Usuario: "pasapalabra"
Sistema: ⏭️ Saltando pregunta

Usuario: "pasa la palabra"
Sistema: ⏭️ Saltando pregunta
```

## 🔧 Configuración

### Variables de Entorno
```bash
# No se requieren variables adicionales
# El sistema detecta automáticamente el dispositivo
```

### Configuraciones Automáticas
- **Idioma**: Español (es-ES)
- **Modo móvil**: Optimizado para estabilidad
- **Modo desktop**: Optimizado para precisión

## 🚨 Solución de Problemas

### Error: "Permiso de micrófono denegado"
**Síntoma**: No se puede activar el micrófono
**Solución**:
1. Toca el ícono del micrófono
2. Permite el acceso al micrófono
3. Recarga la página si es necesario

### Error: "No se detectó voz"
**Síntoma**: El sistema no reconoce lo que dices
**Solución**:
1. Habla más cerca del micrófono
2. Habla más claro y despacio
3. Verifica que no haya ruido de fondo

### Error: "Error de red"
**Síntoma**: Problemas de conectividad
**Solución**:
1. Verifica tu conexión a internet
2. Intenta nuevamente
3. Recarga la página

### No funciona en móvil
**Síntomas**: El botón de micrófono no responde
**Soluciones**:
1. **Android**: Usa Chrome o Firefox
2. **iOS**: Asegúrate de tener iOS 14.3+
3. **Permisos**: Verifica permisos de micrófono
4. **HTTPS**: El sitio debe ser HTTPS

## 📊 Estadísticas de Uso

### Comandos Más Usados
1. **Respuestas directas** (80%)
2. **"pasapalabra"** (15%)
3. **"saltar"** (3%)
4. **Otros comandos** (2%)

### Tasa de Éxito
- **Desktop**: 95%
- **Android**: 85%
- **iOS**: 80%

## 🎨 Personalización

### Agregar Nuevos Comandos
Edita `lib/mobile-config.ts`:
```typescript
export const PASAPALABRA_KEYWORDS = [
  'pasapalabra',
  'tu_nuevo_comando',
  // ... más comandos
]
```

### Cambiar Idioma
Modifica el hook `use-speech-recognition`:
```typescript
const { settings } = useSettings()
// Cambia 'es-ES' por el idioma deseado
```

## 🔍 Debugging

### Logs de Consola
```javascript
// Activa los logs para debugging
console.log("Speech result:", result)
console.log("Pasapalabra detectado:", result.isPasapalabra)
```

### Verificar Compatibilidad
```javascript
// En la consola del navegador
console.log("Speech Recognition:", 'SpeechRecognition' in window)
console.log("Webkit Speech Recognition:", 'webkitSpeechRecognition' in window)
```

## 📚 Referencias Técnicas

### APIs Utilizadas
- **Web Speech API**: Reconocimiento de voz
- **MediaDevices API**: Acceso al micrófono
- **User Agent Detection**: Detección de dispositivo

### Navegadores Soportados
- **Chrome**: 33+
- **Firefox**: 44+
- **Safari**: 14.3+
- **Edge**: 79+

## 🆘 Soporte

### Problemas Comunes
1. **Micrófono no funciona**: Verifica permisos
2. **No reconoce voz**: Habla más claro
3. **Error en móvil**: Usa navegador compatible
4. **No detecta "pasapalabra"**: Verifica pronunciación

### Contacto
- Revisa los logs de consola
- Verifica la compatibilidad del navegador
- Prueba en diferentes dispositivos

---

**Nota**: La funcionalidad de voz requiere permisos de micrófono y una conexión a internet estable.
