
export interface CreateUser {
    username: string
    password: string
    role: string
}

export interface UpdateUser {
    id: string
    username: string
    password: string
    role: string
}