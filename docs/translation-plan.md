# Plan de Traducción - talks.json

## Objetivo

Completar las traducciones de los campos en español (`*_es`) en el archivo `data/talks.json` para soportar la internacionalización del sitio de charlas.

## Estado Actual (Actualizado: 31/12/2024)

- **Estructura migrada**: ✅ Completado
- **Campos en inglés (`*_en`)**: ✅ Ya contienen el contenido original
- **Campos en español (`*_es`)**: 🔄 En progreso
- **Skill de traducción**: ✅ Configurado con terminología técnica

### Progreso de Traducción

✅ **Sprint 1 COMPLETADO**: 12 charlas core 2020-2025 con contenido completo
✅ **Sprint 2 COMPLETADO**: 7 charlas core 2013-2019 con contenido completo
✅ **Sprint 3 COMPLETADO**: 1 charla no-core con contenido completo
✅ **Sprint 4 COMPLETADO**: 21 charlas solo nombre traducido

### Pendientes Identificados

**6 charlas CORE con solo nombre traducido (requieren contenido completo):**
- 2024: La trampa de la complejidad: Reevaluando nuestros incentivos
- 2024: Modelos mentales para Product Developers
- 2023: La trampa de la complejidad: Reevaluando nuestros incentivos
- 2022: Experiencia de Desarrollo & Equipos de Plataforma Modernos
- 2021: Coste basal y la falacia de la construcción
- 2018: Continuous Delivery Germinando una cultura Ágil moderna

**1 charla con anomalía:**
- 2019: DevOps no es lo que crees (CORE, tiene contenido pero falta verificar name_es)

## Campos a Traducir

Para cada charla, necesitamos traducir:

1. `name_es` - Nombre de la charla
2. `description_es` - Descripción breve
3. `key_learning_es` - Aprendizaje clave
4. `key_points_es` - Puntos clave (lista de bullets)

## Plan de Ejecución Actualizado

### Sprint 5: Completar Charlas CORE Pendientes ⏳ EN CURSO

**Objetivo**: Traducir contenido completo de las 6 charlas core que solo tienen nombre

Charlas a traducir:
1. 2024: La trampa de la complejidad: Reevaluando nuestros incentivos
2. 2024: Modelos mentales para Product Developers
3. 2023: La trampa de la complejidad: Reevaluando nuestros incentivos
4. 2022: Experiencia de Desarrollo & Equipos de Plataforma Modernos
5. 2021: Coste basal y la falacia de la construcción
6. 2018: Continuous Delivery Germinando una cultura Ágil moderna

**Campos a traducir por charla**:
- `description_es`
- `key_learning_es`
- `key_points_es`

**Total**: 6 charlas × 3 campos = 18 traducciones

### Verificación Final

- Verificar anomalía: 2019 DevOps no es lo que crees
- Validar que todas las charlas CORE tienen contenido completo
- Validar JSON final

## Metodología de Traducción

### 1. Uso del Skill BilingualTranslator

Utilizar las guías del skill que:
- Mantiene términos técnicos en inglés (TDD, DevOps, MVP, etc.)
- Mezcla natural de inglés técnico con estructura española
- Español neutro de España

### 2. Proceso

Para cada charla:
1. Leer contenido en inglés
2. Traducir siguiendo guías de BilingualTranslator
3. Validar JSON después de cada traducción

### 3. Validación

Después de completar:
1. Verificar que el JSON es válido
2. Revisar que la terminología técnica se mantiene en inglés
3. Confirmar que el tono es apropiado
4. Asegurar que TODAS las charlas CORE tienen contenido completo

## Métricas de Progreso

### Estado Completado

| Sprint | Charlas | Estado | Fecha |
|--------|---------|--------|-------|
| Sprint 1 | 12 core (2020-2025) | ✅ Completado | 31/12/2024 |
| Sprint 2 | 7 core (2013-2019) | ✅ Completado | 31/12/2024 |
| Sprint 3 | 1 no-core | ✅ Completado | 31/12/2024 |
| Sprint 4 | 21 solo nombres | ✅ Completado | 31/12/2024 |
| **Sprint 5** | **6 core pendientes** | **⏳ En curso** | **31/12/2024** |

### Resumen de Traducciones

- ✅ Charlas con contenido completo traducido: 20
- ⏳ Charlas core pendientes de contenido: 6
- ✅ Charlas solo con nombre traducido: 21
- **Total charlas**: 41

## Criterios de Calidad

### ✅ Traducción Aceptable

- Términos técnicos en inglés mantenidos (según skill)
- Estructura gramatical correcta en español
- Tono profesional y neutro
- Coherencia con el contenido original

### ❌ Traducción a Revisar

- Términos técnicos traducidos incorrectamente
- Pérdida de significado técnico
- Tono inadecuado
- Errores gramaticales

## Notas Importantes

- Las charlas con `talk_language: "English"` deberían traducirse igual (la metadata describe la charla, no el idioma en que se dio)
- Mantener consistencia en la terminología técnica a lo largo de todas las traducciones
- El contenido traducido debe ser útil tanto para audiencia técnica como no técnica
- **Prioridad**: TODAS las charlas CORE deben tener contenido completo traducido

## Decisiones Tomadas

1. ✅ Enfoque manual usando BilingualTranslator guidelines
2. ✅ Priorizar charlas CORE primero
3. ✅ Traducir solo nombres para charlas sin contenido
4. ✅ Completar TODAS las charlas CORE con contenido completo

---

**Documento creado**: 30/12/2024
**Última actualización**: 31/12/2024
**Estado**: Sprint 5 en curso - Completando charlas CORE pendientes
