// Model fallback chain — primary to last resort
export const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
] as const;

export type GeminiModel = typeof MODEL_CHAIN[number];

export interface GeminiPayload {
  systemInstruction?: { parts: { text: string }[] };
  contents: { role?: string; parts: { text: string }[] }[];
  generationConfig?: Record<string, unknown>;
}

/**
 * Calls the Gemini API with automatic model fallback.
 * Tries each model in MODEL_CHAIN in order until one succeeds.
 * Logs which model was used and which were skipped.
 */
export async function callGemini(
  payload: GeminiPayload,
  apiKey: string
): Promise<unknown> {
  let lastError: Error | null = null;

  for (const model of MODEL_CHAIN) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`[Gemini] ✓ Using model: ${model}`);
        return await response.json();
      }

      const errBody = await response.text();
      console.warn(`[Gemini] ✗ Model ${model} failed (HTTP ${response.status}) — trying next fallback...`);
      lastError = new Error(`${model} HTTP ${response.status}: ${errBody}`);

    } catch (err) {
      console.warn(`[Gemini] ✗ Model ${model} threw network error — trying next fallback...`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error('[Gemini] All models in fallback chain exhausted.');
}

/** Extracts the text response from a Gemini API response object */
export function extractText(data: unknown): string {
  const d = data as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = d?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('[Gemini] Unexpected response format — no text in candidates.');
  return text;
}
