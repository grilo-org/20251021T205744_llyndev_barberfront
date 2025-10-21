import { apiCall, post, get} from './http'
import type { LoginResponse } from '../types'

export const authApi = {
    login: (email: string, password: string) => post<LoginResponse>('auth/login', {email, password}),
    register: (name: string, email: string, telephone: string, password: string, confirmPassword: string) =>
        post<LoginResponse>('/register', {name, email, telephone, password, confirmPassword}),
    getProfile: () => get<any>('auth/me'),
    logout: () => post<void>('auth/logout')
}