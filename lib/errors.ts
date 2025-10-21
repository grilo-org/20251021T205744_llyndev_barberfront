import axios from 'axios'

export type NormalizedError = {
    message: string
    status?: number
    code?: string
    details?: any
    raw?: any
}

export function normalizeError(err: unknown): NormalizedError {
    if (axios.isAxiosError(err)) {
        const status = err.response?.status
        const data = err.response?.data as any
        const backendMessage = data?.message || data?.error || data?.detail
        return {
            message:backendMessage || 'Erro de comunicação com o servidor',
            status,
            code: data?.code || err.code,
            details: data,
            raw:err
        }
    }

    if (err instanceof Error) {
        return {message: err.message, raw: err}
    }
    return {message: 'Erro desconhecido', raw: err}
}

export function extractUserMessage(normalized: NormalizedError) {
    return normalized.message || 'Ocorreu um erro.'
}

export function logError(normalized: NormalizedError, context?: string) {
    if (process.env.NODE_ENV !== "production") {
        console.error('[ERROR]', context || '', normalized)
    }
}

export function buildErrorToastPayload(normalized: NormalizedError) {
    return {
        title: 'Erro',
        description: extractUserMessage(normalized),
        variant: 'destructive' as const
    }
}
