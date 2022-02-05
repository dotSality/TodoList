import axios, {AxiosResponse} from 'axios';
import {ResponseType} from './todolist-api';

const axiosInstance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/todo-lists/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'ecad3ae6-8083-4154-b722-6cea4b99f288'
    }
})

export const tasksAPI = {
    getTasks(tlId: string) {
        return axiosInstance.get<Response<TaskType[]>>(`${tlId}/tasks`).then(res => res.data)
    },
    createTask(tlId: string, title: string) {
        return axiosInstance.post<{title: string},AxiosResponse<ResponseType<{ item: TaskType }>>>(`${tlId}/tasks`, {title}).then(res => res.data)
    },
    deleteTask(tlId: string, taskId: string) {
        return axiosInstance.delete<ResponseType>(`${tlId}/tasks/${taskId}`).then(res => res.data)
    },
    updateTask(tlId: string, taskId: string, task: TaskModelType) {
        return axiosInstance.put<TaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(`${tlId}/tasks/${taskId}`, task).then(res => res.data)
    }
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    title: string,
    description: string,
    status: TaskStatuses,
    priority: number,
    startDate: string,
    deadline: string,
    id: string,
    todoListId: string,
    order: number,
    addedDate: string,
}

export type TaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type Response<D = {}> = {
    items: D,
    error: string[],
    totalCount: number
}