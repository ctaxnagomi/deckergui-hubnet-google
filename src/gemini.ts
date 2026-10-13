/**
 * The Google execution layer.
 *
 * The original stack runs an assignment through the local Claw runtime. Here the
 * same job is executed by Gemini via the Google Gen AI SDK — the dock agent is
 * minted from a real model call, and its token usage is what the KPI/DSYNC layer
 * meters. With no API key the layer degrades to a deterministic stub so the demo
 * runs offline.
 */

import { GoogleGenAI } from '@google/genai';

export interface ExecutionJob {
  assignmentId: string;
  role: string;
  persona: string;
  instructions: string;
}

export interface ExecutionResult {
  ok: boolean;
  engine: 'gemini' | 'stub';
  model: string;
  text: string;
  tokens: number;
  latencyMs: number;
  error?: string;
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function apiKey(): string | undefined {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY;
}

export async function executeJob(job: ExecutionJob): Promise<ExecutionResult> {
  const started = Date.now();
  const key = apiKey();

  if (!key) {
    return {
      ok: true,
      engine: 'stub',
      model: 'offline-stub',
      text: `[stub] ${job.persona} completed "${job.role}" for ${job.assignmentId} — set GEMINI_API_KEY to run on Gemini.`,
      tokens: 350 + (job.role.length % 200),
      latencyMs: Date.now() - started,
    };
  }

  const prompt =
    `You are the dock agent "${job.persona}" executing a DGUI HUB NET assignment over a peer link.\n` +
    `Role: ${job.role}\nAssignment: ${job.assignmentId}\n\n` +
    `Deliver the work product in under 180 words, then one line "TOKENS~<n>" estimating your own token cost.`;

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const res = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: { systemInstruction: job.instructions || undefined, temperature: 0.4, maxOutputTokens: 512 },
    });

    const text = res.text ?? '';
    const usage = (res as { usageMetadata?: { totalTokenCount?: number } }).usageMetadata;
    return {
      ok: true,
      engine: 'gemini',
      model: DEFAULT_MODEL,
      text,
      tokens: usage?.totalTokenCount ?? 0,
      latencyMs: Date.now() - started,
    };
  } catch (err) {
    return {
      ok: false,
      engine: 'gemini',
      model: DEFAULT_MODEL,
      text: '',
      tokens: 0,
      latencyMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
