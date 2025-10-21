import { get, post, put, del } from './http'
import type { Scheduling, CreateSchedulingPayload, FinalizeRequest } from '../types'

function normalizeScheduling(data: any): Scheduling {
    if (!data || typeof data !== 'object') return data
    const candidateKeys = ['barberService', 'barberServices', 'services', 'serviceList']
    let raw: any[] = []
    for (const k of candidateKeys) if (Array.isArray(data[k])) { raw = data[k]; break}
    const normalized = raw.map((s) => ({
        id: s.id,
        nameService: s.nameService || s.nome || s.name,
        description: s.description || s.descricao || '',
        price: typeof s.price === 'number' ? s.price : (typeof s.preco === 'number' ? s.preco : 0),
        durationInMinutes: typeof s.durationInMinutes === 'number' ? s.durationInMinutes : (typeof s.durationInMinutes === 'number' ? s.duracao : 0),
    }))
    return { ...data, barberService: normalized}
}

function normalizeList(list: any[]): Scheduling[] {
  if (!Array.isArray(list)) return list as any
  return list.map(normalizeScheduling)
}

export const schedulingApi = {
    getAll: () => get<Scheduling[]>('/scheduling').then(normalizeList),
    getByClient: () => get<Scheduling[]>('/scheduling/per-customer').then(normalizeList),
    getByDate: (date: string) => get<Scheduling[]>(`/scheduling/per-day?date=${date}`).then(normalizeList),
    getByBarber: () => get<Scheduling[]>('/scheduling/per-barber').then(normalizeList),
    getById: (id: number) => get<Scheduling>(`/scheduling/${id}`).then(normalizeScheduling),
    create: (payload: CreateSchedulingPayload) => post<Scheduling>('/scheduling', payload).then(normalizeScheduling),
    update: (id: number, data: Partial<Scheduling>) => put<Scheduling>(`/scheduling/${id}`, data).then(normalizeScheduling),
    delete: (id: number) => del(`/scheduling/${id}`),
    getAvailableTime: (date: string, barberServiceIds: number[], barberId: number) => {
        const serviceParams = barberServiceIds.map(id => `barberServiceIds=${id}`).join('&')
        return get<string[]>(`/scheduling/available-times?date=${date}&${serviceParams}&barberId=${barberId}`)
    },
    cancel: (id: number, reason: string) => post(`/scheduling/barber/${id}`, {reason}),
    finish: (id: number, data: FinalizeRequest) =>
        put(`/scheduling/barber/completed/${id}`, {
            paymentMethod: data.paymentMethod,
            observation: data.observation,
            additionalValue: data.additionalValue || 0
        }),
    addServices: (id: number, services: {id: number; quantity: number}[]) => {
        const serviceIds = services.map(s => s.id)
        return post(`/scheduling/barber/add-service/${id}`, {barberServiceIds: serviceIds})
    } 
}