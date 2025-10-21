export type Role = "ADMIN" | "BARBER" | "CLIENT"

export type States = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED"

export type PaymentMethod = "MONEY" | "CREDIT" | "DEBIT" | "PIX" | "TRANSFER"

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY"

export type TypeRule = "RECURRING" | "SPECIFIC_DATE"

export interface User {
    id: number
    name: string
    email: string
    telephone: string
    role: Role
}

export interface BarberService {
    id: number
    nameService: string
    description: string
    price: number
    durationInMinutes: number
}

export interface AdditionalService {
    id: number
    name: string
    price: number
    quantity: number
}

export interface Scheduling {
    id:number
    client: User
    barber: User
    barberService: BarberService[]
    dateTime: string
    states: States
    reason?: string
    paymentMethod?: PaymentMethod
    observation?: string
    additionalValue?: number
    totalValue?: number
    additionalServicesList?: AdditionalService[]
    dateTimeCompletion?: string
}

export interface authResponse {
    token: string
}

export interface SchedulingRequest {
    dateHour: string
}

export interface ReasonRequest {
    reason: string
}

export interface FinalizeRequest {
    paymentMethod: PaymentMethod
    observation?: string
    additionalValue: number
}

export interface WeeklySchedule {
    id?: number
    typeRule: TypeRule
    dayOfWeek: DayOfWeek
    specificDate: string | null
    active: boolean
    openTime: string | null
    closeTime: string | null
}

export interface SpecificDate {
    id?: number
    specificDate: string
    active: boolean
    openTime: string | null
    closeTime: string | null
    typeRule?: TypeRule
}

export interface CreateSchedulingPayload {
    barberServiceId: number[]
    barberId: number
    dateTime: string
}

export interface LoginResponse {
    token: string
}