import axios, { AxiosRequestConfig } from 'axios'
import { normalizeError } from '@/lib/errors'

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers = config.headers || {} 
            ;(config.headers as any).Authorization = `Bearer ${token}`
        }
    }
    return config
})

http.interceptors.response.use(
    (r) => r,
    (error) => {
        const status = error?.response?.status
        if ((status === 401 || status === 403) && typeof window !== 'undefined') {
            try {window.dispatchEvent(new Event('auth-error'))} catch {}
        }
        return Promise.reject(error)
    }
)

export async function apiCall<T>(fn: () => Promise<{ data: T}>): Promise<T> {
    try {
        const res = await fn()
        return res.data
    } catch (e) {
        throw normalizeError(e)
    }
}

export function get<T>(url: string, config?: AxiosRequestConfig) {
    return apiCall<T>(() => http.get<T>(url, config))
}

export function post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return apiCall<T>(() => http.post<T>(url, data, config))
}

export function put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return apiCall<T>(() => http.put<T>(url, data, config))
}

export function del<T = void>(url: string, config?: AxiosRequestConfig) {
    return apiCall<T>(() => http.delete<T>(url, config))
}

export function patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return apiCall<T>(() => http.patch<T>(url, data, config))
}