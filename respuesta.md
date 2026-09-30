# Respuestas — Integración de Inteligencia Artificial

## Pregunta 1

**La empresa desea utilizar un modelo de inteligencia artificial para identificar automáticamente las habilidades técnicas del candidato a partir de su carta de presentación y compararlas con las requeridas por la vacante. Explique cómo integraría esta capacidad a la solución desarrollada.**

### Respuesta

La capacidad de inteligencia artificial se integraría como un servicio adicional dentro del backend, sin reemplazar las reglas principales del sistema.

El proceso podría funcionar de la siguiente manera:

1. El candidato proporciona su **carta de presentación** y la información relacionada con sus habilidades.
2. El backend recibe esta información y la envía al modelo de IA mediante un **prompt automatizado**.
3. El prompt debe proporcionar al modelo el contexto necesario, por ejemplo:
   - Información de la vacante.
   - Habilidades técnicas requeridas.
   - Catálogo de habilidades válidas de la empresa.
   - Carta de presentación del candidato.
4. El modelo analiza el texto e identifica las habilidades técnicas mencionadas o relacionadas con el candidato.
5. El backend recibe la respuesta del modelo y compara las habilidades identificadas con las habilidades requeridas por la vacante.
6. Finalmente, el sistema puede almacenar el resultado para utilizarlo como información adicional dentro del proceso de selección.

Además, podrían utilizarse **pruebas técnicas** para obtener información más objetiva sobre las habilidades del candidato. En estas pruebas, el participante demostraría sus conocimientos directamente mediante ejercicios o preguntas relacionadas con las tecnologías requeridas.

Los prompts utilizados por el sistema deberían estar automatizados y diseñados específicamente para cada tipo de evaluación. Por ejemplo, se podría proporcionar al modelo la información completa de una prueba técnica y solicitar que identifique las habilidades demostradas por el candidato.

Es importante que la IA funcione como un **mecanismo de apoyo para el análisis**, mientras que las reglas determinísticas del backend continúan controlando los datos válidos y las operaciones críticas del sistema.

---

## Pregunta 2

**Suponga que el modelo de IA devuelve ocasionalmente una respuesta con formato inválido o habilidades que no existen en el catálogo de la empresa. Explique cómo debería manejar esta situación el backend.**

### Respuesta

El backend no debería confiar directamente en la respuesta proporcionada por el modelo de IA. La respuesta debe pasar primero por un proceso de **validación y normalización**.

Por ejemplo, si el sistema espera una respuesta en formato JSON, el backend debería:

1. Recibir la respuesta del modelo.
2. Intentar convertirla o validarla como JSON.
3. Verificar que tenga la estructura esperada.
4. Validar los tipos de datos de cada propiedad.
5. Comprobar que las habilidades devueltas existan en el **catálogo oficial de habilidades de la empresa**.
6. Eliminar o rechazar habilidades desconocidas.
7. Registrar el error cuando la respuesta no cumpla con el formato esperado.
8. Si es necesario, volver a solicitar la respuesta al modelo utilizando un prompt de corrección.
9. Si después de varios intentos la respuesta continúa siendo inválida, el backend debería manejar el error de forma controlada y no utilizar información no validada.

Por ejemplo, si el catálogo contiene:

```text
Java
Python
SQL
Node.js
Docker