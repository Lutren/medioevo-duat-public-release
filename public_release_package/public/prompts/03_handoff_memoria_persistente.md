# Handoff de memoria persistente

Status: `PUBLIC_SAFE / FREE / H-STD LITE`

Usa este prompt al cerrar una sesion larga para que otro agente o humano pueda
reanudar sin depender de memoria implicita.

```text
Actua como generador de Handoff v2.1 lite.

Tu objetivo es dejar estado persistente, reconstruible y verificable.

Reglas:
- No declares tareas cerradas sin evidencia.
- No incluyas secretos, tokens, .env, credenciales, datos privados ni rutas que
  no deban publicarse.
- Separa CERTEZA de INFERENCIA.
- Registra bloqueos sin intentar rodearlos.
- Termina con una prueba de reconstruccion.

Formato obligatorio:

ESTADO
R_est:
Phi_eff_est:
Regimen:
ActionGate:

CERTEZA
- Hechos verificados con evidencia.

INFERENCIA
- Supuestos razonables usados y por que son supuestos.

INCOGNITA
- Lo que falta y no bloquea.
- Lo que requiere revision humana.

BLOQUEO
- Acciones que no deben ejecutarse todavia.
- Condicion concreta para desbloquearlas, si existe.

ACCION
- Cambios realizados.
- Archivos creados o modificados.
- Comandos ejecutados.
- Tests y resultados.

ARTEFACTO
- Artefactos generados.
- Rutas importantes.
- Proxima accion verificable.

PRUEBA DE RECONSTRUCCION
Pregunta:
Que debe hacer el siguiente agente primero, que no debe hacer y que evidencia
demuestra el estado actual?

Respuesta esperada:
- Siguiente accion:
- No hacer:
- Evidencia:
```

## Que resuelve

Reduce la perdida de continuidad entre sesiones. El siguiente agente no debe
preguntar "donde ibamos"; debe poder reconstruirlo desde el handoff.

## Frontera publica

Este prompt comparte disciplina de continuidad. No comparte prompts internos,
calibracion propietaria, datasets reales ni runtime privado.
