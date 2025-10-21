import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PaymentMethod  } from "./types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const paymentLabels: Record<string, string> = {
    MONEY: "Dinheiro",
    CREDIT: "Cartão de Crédito",
    DEBIT: "Cartão de Débito",
    PIX: "PIX",
    TRANSFER: "Transferência"
}

export function getPaymentLabel(method?: PaymentMethod | string | null) {
    if (!method) return "-"
    return paymentLabels[method] || method
}

export function getGorjeta(additionalValue?: number | null) {
    return additionalValue && additionalValue > 0 ? additionalValue : 0
}

export function sumServicePrice(raw: any) {
    if (!raw) return 0
    const services = (raw as any).barberService || (raw as any).services || []
    return services.reduce((sum: number, s:any) => sum + (s.price || 0 ), 0)
}

export function sumServiceDuration(raw: any) {
    if (!raw) return 0
    const services = (raw as any).barberService || (raw as any).services || []
    return services.reduce((sum: number, s: any) => sum + (s.durationInMinutes || 0), 0)
}

export function listServiceNames(raw: any) {
    if (!raw) return 0
    const services = (raw as any).barberService || (raw as any).services || []
    return services.map((s: any) => s.nameService)
}

export function sumAddtionalServices(raw: any) {
    if (!raw) return 0
    const additional = (raw as any).additionalServicesList
    if (!Array.isArray(additional)) return 0
    return additional.reduce((sum: number, a: any) => {
        const price = a.price || a.price || 0 
        const qty = a.quantity || 1
        return sum + price * qty
    }, 0)
}

export function totalAppointmentValue(raw: any) {
    return sumServicePrice(raw) + sumAddtionalServices(raw)
}