import { normalizeError, logError, buildErrorToastPayload } from "@/lib/errors";
import { useToast } from "./use-toast";
import { useCallback } from "react";


export function useErrorToast(context?: string) {
    const { toast } = useToast()

    const pushError = useCallback((err: unknown, override?: { title?: string; description?: string}) => {
        const normalized = normalizeError(err)
        logError(normalized, context)
        const payload = buildErrorToastPayload(normalized)
        toast({
            ...payload,
            title: override?.title || payload.title,
            description: override?.description || payload.description,
        })
        return normalized
    }, [toast, context])

    return { pushError }
}