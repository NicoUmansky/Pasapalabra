# Sistema de Sincronización de Preguntas - Pasapalabra

## Descripción

Este sistema permite descargar las preguntas desde Supabase una sola vez y mantenerlas en un archivo JSON local. Solo se modifican las preguntas desde el panel de administrador.

## Características

- ✅ **Sincronización única**: Las preguntas se descargan desde Supabase solo la primera vez
- ✅ **Almacenamiento local**: Las preguntas se mantienen en `lib/questions-from-supabase.json`
- ✅ **Sin sobrescritura**: El archivo local no se sobrescribe automáticamente
- ✅ **Panel de administrador**: Solo desde ahí se pueden modificar las preguntas
- ✅ **Fallback**: Si no hay conexión a Supabase, usa preguntas por defecto

## Archivos del Sistema

### 1. `lib/supabase/questions-sync.ts`
- Funciones para sincronizar preguntas desde Supabase
- Descarga y guarda en archivo local
- Verifica si ya existe el archivo local

### 2. `lib/questions-from-supabase.json`
- Archivo JSON con las preguntas descargadas
- Se crea automáticamente en la primera sincronización
- No se sobrescribe en ejecuciones posteriores

### 3. `scripts/sync-questions.js`
- Script de Node.js para sincronización manual
- Útil para la primera vez o para forzar sincronización

### 4. `lib/questions-data.ts`
- Sistema de carga de preguntas
- Prioriza archivo local sobre Supabase
- Fallback a preguntas por defecto

## Uso

### Primera Vez (Sincronización Inicial)

1. **Configurar variables de entorno**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

2. **Ejecutar script de sincronización**:
   ```bash
   node scripts/sync-questions.js
   ```

3. **Verificar archivo creado**:
   - Se creará `lib/questions-from-supabase.json`
   - Contendrá todas las preguntas de Supabase

### Uso Normal

- **El juego carga automáticamente** las preguntas desde el archivo local
- **No se conecta a Supabase** para leer preguntas
- **Solo se conecta** cuando se modifican desde el panel de administrador

### Modificar Preguntas

1. **Acceder al panel de administrador** (`/admin`)
2. **Editar, agregar o eliminar** preguntas
3. **Los cambios se guardan** tanto en Supabase como en el archivo local
4. **El juego usa inmediatamente** las preguntas actualizadas

## Flujo de Datos

```
Supabase (solo lectura inicial)
    ↓
Archivo Local (questions-from-supabase.json)
    ↓
Juego (consume desde archivo local)
    ↓
Panel Admin (modifica y sincroniza ambos)
```

## Ventajas

- **Rendimiento**: No hay latencia de red al cargar preguntas
- **Confiabilidad**: Funciona sin conexión a internet
- **Control**: Solo el admin puede modificar preguntas
- **Eficiencia**: Una sola descarga inicial
- **Seguridad**: No se sobrescriben datos accidentalmente

## Troubleshooting

### Error: "Variables de entorno no configuradas"
- Verificar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas

### Error: "No se encontraron preguntas en Supabase"
- Verificar que la tabla `questions` en Supabase tenga datos
- Verificar permisos de lectura

### Forzar Nueva Sincronización
- Eliminar el archivo `lib/questions-from-supabase.json`
- Ejecutar nuevamente `node scripts/sync-questions.js`

### Preguntas No Se Actualizan
- Verificar que el panel de administrador esté guardando correctamente
- Verificar permisos de escritura en Supabase
- Verificar que el archivo local se esté actualizando

## Notas Importantes

- **Nunca editar manualmente** `questions-from-supabase.json`
- **Siempre usar el panel de administrador** para modificar preguntas
- **El archivo local es la fuente de verdad** para el juego
- **Supabase se usa solo para persistencia** y sincronización
- **Las preguntas por defecto** solo se usan si no hay archivo local ni conexión
