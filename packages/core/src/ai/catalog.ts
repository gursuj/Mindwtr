import type { AIProviderConfig, AIProviderId, AIReasoningEffort } from './types';

export const OPENAI_DEFAULT_MODEL = 'gpt-5-mini';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';
export const OPENAI_COPILOT_DEFAULT_MODEL = 'gpt-4o-mini';
export const GEMINI_COPILOT_DEFAULT_MODEL = 'gemini-2.0-flash-lite';
export const DEFAULT_GEMINI_THINKING_BUDGET = 0;

export const OPENAI_MODEL_OPTIONS = [
    'gpt-5-mini',
    'gpt-5-nano',
    'gpt-4o-mini',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
];
export const GEMINI_MODEL_OPTIONS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-3-flash-preview',
];

export const DEFAULT_REASONING_EFFORT: AIReasoningEffort = 'low';

export function getDefaultAIConfig(provider: AIProviderId): AIProviderConfig {
    return {
        provider,
        apiKey: '',
        model: provider === 'openai' ? OPENAI_DEFAULT_MODEL : GEMINI_DEFAULT_MODEL,
        reasoningEffort: DEFAULT_REASONING_EFFORT,
        ...(provider === 'gemini' ? { thinkingBudget: DEFAULT_GEMINI_THINKING_BUDGET } : {}),
    };
}

export function getModelOptions(provider: AIProviderId): string[] {
    return provider === 'openai' ? OPENAI_MODEL_OPTIONS : GEMINI_MODEL_OPTIONS;
}

export function getDefaultCopilotModel(provider: AIProviderId): string {
    return provider === 'openai' ? OPENAI_COPILOT_DEFAULT_MODEL : GEMINI_COPILOT_DEFAULT_MODEL;
}

export function getCopilotModelOptions(provider: AIProviderId): string[] {
    return getModelOptions(provider);
}
