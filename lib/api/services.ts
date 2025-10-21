import { get, post, put, del } from "./http";
import type { BarberService } from "../types";

export const servicesApi = {
    getAll: () => get<BarberService[]>('/barber-service'),
    getById: (id: number) => get<BarberService>(`/barber-service/${id}`),
    create: (data: Partial<BarberService>) => post<BarberService>('/barber-service', data),
    update: (id: number, data: Partial<BarberService>) => put<BarberService>(`/barber-service/${id}`, data),
    delete: (id: number) => del(`/barber-service/${id}`)
}