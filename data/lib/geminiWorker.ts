// lib/geminiWorker.ts

import { GoogleGenAI } from "@google/genai";

export type WorkerChatMessage = {
  role: "user" | "model";
  text: string;
};

/**
 * Llama directamente a la API de Gemini usando el SDK oficial.
 * Reemplaza al Cloudflare Worker que estaba fallando.
 */
export async function askGeminiWorker(args: {
  system?: string;
  prompt: string;
  history?: WorkerChatMessage[];
  timeoutMs?: number;
}): Promise<{ text: string }> {
  const { system, prompt, history = [] } = args;

  // Usamos process.env.GEMINI_API_KEY según las directrices de la plataforma
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("GEMINI_API_KEY no está configurada.");
    return { text: "Lo siento pana, no tengo conexión con el chef ahora mismo. (Falta API Key)" };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Mapeamos el historial al formato que espera el SDK
    const contents = history.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Agregamos el prompt actual
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: system || "Eres un asistente servicial.",
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    // El SDK devuelve el texto directamente en la propiedad .text
    return { text: response.text || "No pude generar una respuesta, pana." };
  } catch (error) {
    console.error("Error llamando a Gemini API:", error);
    // Devolvemos un mensaje amigable en lugar de fallar silenciosamente
    return { text: "¡Epa pana! Se me quemaron los cables en la cocina. Intentemos de nuevo." };
  }
}

