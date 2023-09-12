export interface CreateTemp {
    id: number
    temp: string
    humidity: string
    time: string
    day: string
}

export interface UpdateTemp {
    temp: string
    humidity: string
    time: string
    day: string
}

export interface Daytemps {
    day: string
    time: string
    temp: string
    humidity: string
}