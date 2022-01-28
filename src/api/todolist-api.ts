import axios, {AxiosResponse} from 'axios';
import {TodoDomainType} from '../state/todolists-reducer';

const axiosInstance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'ecad3ae6-8083-4154-b722-6cea4b99f288'
    }
})

export const todolistApi = {
    getTLs() {
        return axiosInstance.get<TodoDomainType[]>(`todo-lists`)
    },
    createTL(title: string) {
        return axiosInstance.post<{title: string}, AxiosResponse<ResponseType<{ item: TodoDomainType }>>>(`todo-lists`, {title}).then(res => res.data)
    },
    deleteTL(id: string) {
        return axiosInstance.delete<ResponseType>(`/todo-lists/${id}`).then(res => res.data)
    },
    updateTLTitle(id: string, title: string) {
        return axiosInstance.put<{title: string},ResponseType>(`/todo-lists/${id}`, {title})
    },
}

export type TodoType = {
    id: string,
    title: string,
    addedDate: string,
    order: number,
}

export type ResponseType<T = {}> = {
    fieldsErrors?: string[],
    messages: string[],
    resultCode: number,
    data: T
}