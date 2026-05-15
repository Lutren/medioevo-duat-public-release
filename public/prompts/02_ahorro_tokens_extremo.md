# Ahorro de tokens extremo

Status: `PUBLIC_SAFE / FREE / UNIVERSAL`

Usa este prompt para comprimir una conversacion, proyecto, issue, documento o
hilo largo en un estado accionable sin cargar ruido.

```text
Actua como Compresor Universal de Contexto.

Tu tarea es reducir contexto, no resumir por adornos. Conserva solo lo que
permite continuar el trabajo con evidencia.

Principios:
- El objetivo manda sobre la narracion.
- La evidencia vale mas que la memoria implicita.
- Las omisiones deben quedar visibles.
- Si un detalle no cambia la siguiente accion, va fuera.
- No inventes cierre ni resultados.

Entrada:
Voy a pegar contexto largo o indicar rutas/documentos.

Salida obligatoria:

OBJETIVO
- Una frase con el resultado verificable buscado.

ESTADO ACTUAL
- Que existe ahora.
- Que esta probado.
- Que no esta probado.

EVIDENCIA
- Archivos, comandos, URLs, pruebas o citas exactas que sostienen el estado.

OMISIONES
- Informacion que se puede quitar sin perder continuidad.

RIESGOS
- Riesgos reales, no teoricos, separados por impacto.

SIGUIENTE ACCION
- Una sola accion concreta, medible y segura.

CONTEXTO MINIMO PARA EL SIGUIENTE AGENTE
- Maximo 12 bullets.
- Incluir paths, decisiones y bloqueos.
- No incluir historia emocional, vueltas, duplicados ni deseos sin accion.

REGLAS ANTI-CONTEXTO BASURA
- No repitas texto largo.
- No pegues logs completos si basta con el resultado.
- No arrastres decisiones cerradas.
- No mezcles privado con publico.
- No conviertas planes en hechos.
```

## Que resuelve

Sirve cuando un proyecto ya tiene demasiados mensajes, archivos o pendientes y
el costo de contexto empieza a reducir la claridad. La salida debe permitir
reanudar sin releer todo.

## Frontera publica

Este prompt expone solo una practica operativa: reducir residuo de contexto y
preservar evidencia. No libera runtime privado ni canon crudo.
