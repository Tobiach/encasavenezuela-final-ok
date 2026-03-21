export type WorkerChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function askGeminiWorker(args: {
  system?: string;
  prompt: string;
  history?: WorkerChatMessage[];
  timeoutMs?: number;
}): Promise<{ text: string }> {
  const { prompt, history = [] } = args;

  await new Promise(resolve => setTimeout(resolve, 600));

  const promptLower = prompt.toLowerCase();

  if (promptLower.includes('espectacular') || promptLower.includes('razón') || history.length === 0) {
    return { text: "¡Épale pana! Este producto es puro sabor venezolano de calidad. Perfecto para compartir en familia. ¿Querés saber cómo prepararlo o con qué combinarlo?" };
  }

  if (promptLower.includes('preparar') || promptLower.includes('cocinar') || promptLower.includes('receta') || promptLower.includes('cómo')) {
    return { text: "Te lo recomiendo calentarlo a fuego medio para que quede en su punto. Combina perfecto con queso rallado. ¿Necesitás más tips?" };
  }

  if (promptLower.includes('acompañar') || promptLower.includes('combinar') || promptLower.includes('con qué')) {
    return { text: "Va brutal con una malta bien fría y unos tequeños. ¡Combo ganador! ¿Te interesa agregarlo?" };
  }

  if (promptLower.includes('gracias') || promptLower.includes('ok') || promptLover.includes('dale')) {
    return { text: "¡De nada, pana! ¿Algo más?" };
  }

  return { text: "¡Chévere! Este es de los más pedidos. ¿Querés que te diga cómo prepararlo o con qué combinarlo?" };
}


// PanaChef AI - Temporalmente deshabilitado
// Se reactivará cuando la cuota de Gemini se resetee (4am diario)

export type WorkerChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function askGeminiWorker(args: {
  system?: string;
  prompt: string;
  history?: WorkerChatMessage[];
  timeoutMs?: number;
}): Promise<{ text: string }> {
  return { text: "Función deshabilitada temporalmente." };
}


