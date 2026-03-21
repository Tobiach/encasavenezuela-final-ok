import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

const MODELS_TO_TEST = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-pro',
];

const TEST_PROMPT = 'Respondé solo: "OK"';

async function testModel(modelName: string): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });

  const start = Date.now();
  try {
    const result = await model.generateContent(TEST_PROMPT);
    const text = result.response.text();
    const latencyMs = Date.now() - start;
    return { ok: true, latencyMs };
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    // Extraer solo el mensaje relevante (evitar stack traces largos)
    // Capturar mensaje completo para diagnóstico
    const short = msg.replace(/\n/g, ' ').substring(0, 200);
    return { ok: false, latencyMs, error: short };
  }
}

async function main() {
  console.log('\n🔑 API Key:', API_KEY ? API_KEY.substring(0, 12) + '...' : '❌ MISSING');
  console.log('━'.repeat(70));

  if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY no encontrada en .env.local');
    process.exit(1);
  }

  const results: { model: string; ok: boolean; latencyMs?: number; error?: string }[] = [];

  for (const modelName of MODELS_TO_TEST) {
    process.stdout.write(`  Testing ${modelName.padEnd(30)} `);
    const result = await testModel(modelName);
    results.push({ model: modelName, ...result });

    if (result.ok) {
      console.log(`✅  ${result.latencyMs}ms`);
    } else {
      console.log(`❌  ${result.latencyMs}ms  →  ${result.error}`);
    }
  }

  const working = results.filter(r => r.ok);
  const failed  = results.filter(r => !r.ok);

  console.log('\n' + '━'.repeat(70));
  console.log(`✅ Modelos que funcionan (${working.length}):`);
  working
    .sort((a, b) => (a.latencyMs ?? 0) - (b.latencyMs ?? 0))
    .forEach(r => console.log(`   ${r.model.padEnd(30)} ${r.latencyMs}ms`));

  if (failed.length > 0) {
    console.log(`\n❌ Modelos que fallaron (${failed.length}):`);
    failed.forEach(r => console.log(`   ${r.model}`));
  }

  if (working.length > 0) {
    console.log(`\n⭐ Recomendado (más rápido): ${working.sort((a, b) => (a.latencyMs ?? 0) - (b.latencyMs ?? 0))[0].model}`);
  }

  console.log('');
}

main();