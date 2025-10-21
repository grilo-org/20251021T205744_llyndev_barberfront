import { get, put, post, del } from './http'
import { WeeklySchedule, SpecificDate } from '../types'

export const weeklyScheduleApi = {
    getAll:  () => get<WeeklySchedule[]>('/opening-hours/weekly-schedule'),
    upsert: (payload: WeeklySchedule | WeeklySchedule[]) => put<WeeklySchedule | WeeklySchedule[]>('/opening-hours/weekly-schedule', payload),
}

export const specificDateApi = {
    getAll: () => get<SpecificDate[]>('/opening-hours/specific-date'),
    create: (payload: SpecificDate) => post<SpecificDate>('/opening-hours/specific-date', payload),
    update: (id: number, payload: SpecificDate) => put<SpecificDate>(`/opening-hours/specific-date/${id}`, payload),
    delete: (id: number) => del(`/opening-hours/specific-date/${id}`) 
}