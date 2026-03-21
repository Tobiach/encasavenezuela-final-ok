export type WorkerChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function askGeminiWorker(_args: {
  system?: string;
  prompt: string;
  history?: WorkerChatMessage[];
  timeoutMs?: number;
}): Promise<{ text: string }> {
  return { text: "Función deshabilitada temporalmente." };
}
