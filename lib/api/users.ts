import {get, post, put, del, patch} from './http'
import { User } from '@/lib/types'

export const usersApi = {
    getAll: () => get<User[]>('/users'),
    getById: (id: number) => get<User>(`/users/${id}`),
    create: (user: Partial<User>) => post<User>('/users', user),
    update: (id:number, user: Partial<User>) => put<User>(`/users/${id}`, user),
    delete: (id: number) => get(`/users/${id}`),
    getBarbers: () => get<User[]>('/users/barbers'),
    updateRole: (id: number, role: string) => patch<User>(`/users/${id}`, { role })
}