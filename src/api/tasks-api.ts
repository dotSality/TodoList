import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/todo-lists/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'ecad3ae6-8083-4154-b722-6cea4b99f288'
    }
})

export const tasksAPI = {
    getTasks(tlId: string) {
        return axiosInstance.get(`${tlId}/tasks`).then(res => res.data)
    },
    createTask(tlId: string, title: string) {
        return axiosInstance.post(`${tlId}/tasks`, {title}).then(res => res.data)
    },
    deleteTask(tlId: string, taskId: string) {
        return axiosInstance.delete(`${tlId}/tasks/${taskId}`).then(res => res.data)
    },
    updateTask(tlId: string, taskId: string, task: TaskType) {
       return axiosInstance.put(`${tlId}/tasks/${taskId}`, task)
    }
}

export type TaskType = {
    title: string,
    description: string | null,
    status: number,
    priority: number,
    startDate: any,
    deadline: any,
}