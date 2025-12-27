export function parseJson<T>(raw: string): T {
    const trimmed = raw.trim();
    if (!trimmed) {
        throw new Error('AI response was empty.');
    }
    const cleaned = trimmed
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim();
    try {
        return JSON.parse(cleaned) as T;
    } catch (error) {
        const objectStart = cleaned.indexOf('{');
        const objectEnd = cleaned.lastIndexOf('}');
        if (objectStart !== -1 && objectEnd > objectStart) {
            const sliced = cleaned.slice(objectStart, objectEnd + 1);
            return JSON.parse(sliced) as T;
        }
        const arrayStart = cleaned.indexOf('[');
        const arrayEnd = cleaned.lastIndexOf(']');
        if (arrayStart !== -1 && arrayEnd > arrayStart) {
            const sliced = cleaned.slice(arrayStart, arrayEnd + 1);
            return JSON.parse(sliced) as T;
        }
        const message = error instanceof Error ? error.message : String(error);
        const preview = cleaned.length > 240 ? `${cleaned.slice(0, 240)}…` : cleaned;
        throw new Error(`AI JSON parse error: ${message}. Raw: ${preview}`);
    }
}
