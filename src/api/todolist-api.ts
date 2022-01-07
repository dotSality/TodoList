import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'ecad3ae6-8083-4154-b722-6cea4b99f288'
    }
})

export const todolistApi = {
    getTLs() {
        return axiosInstance.get<TLType[]>(`todo-lists`).then(res => res.data)
    },
    createTL(title: string) {
        return axiosInstance.post<Response<{ item: TLType }>>(`todo-lists`, {title}).then(res => res.data)
    },
    deleteTL(id: string) {
        return axiosInstance.delete<Response>(`/todo-lists/${id}`).then(res => res.data)
    },
    updateTLTitle(id: string, title: string) {
        return axiosInstance.put<Response>(`/todo-lists/${id}`, {title}).then(res => res.data)
    },
}

type TLType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

type Response<T = {}> = {
    fieldsErrors: string[],
    messages: string[],
    resultCode: number,
    data: T
}