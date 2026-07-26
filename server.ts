import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper lazy init Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in process.env');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'StudyPrime API' });
  });

  // 1. AI TUTOR CHAT ENDPOINT
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, level, subject, studyMode, levelAdaptation, language } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGeminiClient();

      const langInstruction = language === 'en' 
        ? 'Respond in clear, encouraging English.' 
        : 'Responde en español claro, natural y motivador, adaptado al currículo escolar y universitario de España y Latinoamérica.';

      const systemInstruction = `Eres "StudyPrime AI", un tutor académico virtual experto 24/7 disponible para estudiantes de ${level || 'Bachillerato'}.
Especializado en la asignatura: ${subject || 'General'}.
Modo de estudio actual: ${studyMode || 'Explicación General'}.
Nivel de profundidad deseado: ${levelAdaptation || 'Intermedio'}.
${langInstruction}

REGLA CRÍTICA DE FORMATO:
- NO utilices símbolos de formato Markdown como '#' para encabezados ni '*' para negritas, cursivas o viñetas.
- Escribe respuestas limpias en texto plano. Usa mayúsculas si quieres enfatizar un concepto importante y listas numeradas (1, 2, 3) o guiones (-) para desglosar información.
- ÚNICAMENTE se permite el asterisco '*' cuando sea indispensable como notación científica, fórmula matemática (multiplicación) o un nombre propio oficial que lo lleve (por ejemplo: Sagitario A*).

Pautas pedagógicas:
- Si el estudiante te pide resolver un problema o ejercicio, muestra el procedimiento completo PASO A PASO con fórmulas claras.
- Si el usuario te pide un plan de estudio, estructúralo por días o semanas con metas alcanzables.
- Sé empático, claro, pedagógico y estimulante.
- Al final de cada respuesta importante, ofrece 2 o 3 preguntas de seguimiento o sugerencias para continuar aprendiendo.`;

      // Select model
      const model = (studyMode === 'exercise_solver' || levelAdaptation === 'avanzado') 
        ? 'gemini-3.1-pro-preview' 
        : 'gemini-3.6-flash';

      // Build chat prompt or history
      const formattedPrompt = `${systemInstruction}\n\nPregunta del estudiante: ${message}`;

      const response = await ai.models.generateContent({
        model: model,
        contents: formattedPrompt,
      });

      let textOutput = response.text || 'No pude generar una respuesta en este momento. Intenta de nuevo.';

      // Clean unwanted markdown formatting (# and *) while preserving proper usages (e.g. Sagitario A*)
      textOutput = textOutput
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^\*\s+/gm, '- ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/(^|\s)\*([^*]+)\*(\s|$)/g, '$1$2$3');

      res.json({
        reply: textOutput,
        modelUsed: model
      });
    } catch (error: any) {
      console.error('Error in /api/ai/chat:', error);
      res.status(500).json({ 
        error: 'Error al procesar la consulta con el Tutor IA',
        details: error?.message || String(error)
      });
    }
  });

  // 2. SMART SCANNER & OCR EXERCISE SOLVER ENDPOINT
  app.post('/api/ai/scanner', async (req, res) => {
    try {
      const { imageBase64, mimeType, textInput, mode, language } = req.body;

      const ai = getGeminiClient();

      const langPrompt = language === 'en' ? 'Respond in English.' : 'Responde en Español.';

      let contents: any;

      if (imageBase64) {
        // Multimodal call
        const imagePart = {
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        };
        const textPart = {
          text: `Analiza la imagen escaneada que contiene un problema, fórmula matemática o texto de un libro de estudio.
Modo de análisis: ${mode || 'resolver_ejercicio'}.
Instrucciones:
1. Identifica y transcribe el texto o la ecuación de la imagen (OCR).
2. Si es un problema o ecuación matemática/física, resuélvelo PASO A PASO detallando cada paso del proceso algebraico o conceptual.
3. Si es un texto de libro o apuntes, genera un resumen condensado con los puntos clave.
${langPrompt}`
        };
        contents = { parts: [imagePart, textPart] };
      } else {
        contents = `Analiza el siguiente texto escaneado de un apunte o libro:
"${textInput}"
Modo: ${mode || 'resolver_ejercicio'}.
Proporciona la solución paso a paso o un resumen pedagógico según corresponda. ${langPrompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents,
      });

      res.json({
        result: response.text || 'No se pudo analizar la imagen/texto escaneado.'
      });
    } catch (error: any) {
      console.error('Error in /api/ai/scanner:', error);
      res.status(500).json({ 
        error: 'Error al analizar con el escáner inteligente',
        details: error?.message || String(error)
      });
    }
  });

  // 3. AUTOMATIC STUDY MATERIAL GENERATOR (FLASHCARDS, QUIZZES, SUMMARIES)
  app.post('/api/ai/generate-material', async (req, res) => {
    try {
      const { sourceText, topic, subject, level, language } = req.body;

      if (!sourceText && !topic) {
        return res.status(400).json({ error: 'Text or topic is required' });
      }

      const ai = getGeminiClient();

      const langText = language === 'en' ? 'English' : 'Spanish';

      const prompt = `A partir del siguiente material de estudio sobre "${topic || 'General'}" (${subject || 'General'}, ${level || 'Bachillerato'}):
---
${sourceText || topic}
---

Genera un conjunto estructurado en idioma ${langText} que contenga:
1. Resumen ejecutivo condensado (summaryText).
2. Mapa conceptual en texto (conceptMap).
3. Exactamente 5 tarjetas de memoria (flashcards) con pregunta, respuesta clara, explicación y dificultad.
4. Exactamente 3 preguntas tipo test (quizzes) con 4 opciones cada una, el índice de la respuesta correcta (0-3) y una explicación pedagógica.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryText: { type: Type.STRING, description: 'Resumen condensado' },
              conceptMap: { type: Type.STRING, description: 'Esquema jerárquico del tema' },
              flashcards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    difficulty: { type: Type.STRING, description: 'fácil | medio | difícil' }
                  },
                  required: ['question', 'answer']
                }
              },
              quizzes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING } 
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ['question', 'options', 'correctAnswerIndex', 'explanation']
                }
              }
            },
            required: ['summaryText', 'conceptMap', 'flashcards', 'quizzes']
          }
        }
      });

      const jsonStr = response.text || '{}';
      const parsedData = JSON.parse(jsonStr);

      res.json(parsedData);
    } catch (error: any) {
      console.error('Error in /api/ai/generate-material:', error);
      res.status(500).json({ 
        error: 'Error al generar material de estudio automático',
        details: error?.message || String(error)
      });
    }
  });

  // Catch-all 404 handler for API routes (prevents falling through to Vite index.html)
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `Ruta de API no encontrada: ${req.method} ${req.path}` });
  });

  // Global API Error Handler (prevents Express sending HTML error pages)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.path.startsWith('/api')) {
      console.error('Express API Error:', err);
      return res.status(err.status || 500).json({
        error: err.message || 'Error interno en el servidor API',
      });
    }
    next(err);
  });

  // Vite Middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyPrime Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
