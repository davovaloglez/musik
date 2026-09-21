---
description: Directrices de diseño de interfaz y controles de reproducción para Musik
trigger: always_on
---

# Directrices de Controles de Reproducción y Limpieza Visual

1. **Punto Único de Control de Progresión**:
   - El control de inicio y detención de la progresión general (`startProgression` / `stopProgression`) debe residir de forma exclusiva en la barra de herramientas del **Visualizador**.
   - No añadir botones duplicados de reproducción/detención en secciones secundarias (como el *Generador de Secuencia y Ritmo* o la *Biblioteca de Cadencias*).

2. **Propósito de los Paneles Secundarios**:
   - Las secciones de configuración (armador de secuencias, selección de acordes, biblioteca) deben enfocarse en edición, selección y preescucha contextual aislada, sin duplicar los disparadores globales de reproducción.

3. **Criterio de Reducción de Ruido Visual**:
   - Si una acción principal ya cuenta con un control interactivo de acceso directo en el lienzo o visualizador, evitar redundancias que saturen la vista.
