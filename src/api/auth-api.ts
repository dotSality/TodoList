import axios, {AxiosResponse} from 'axios';
import {ResponseType} from './todolist-api';

const axiosInstance = axios.create({
    baseURL: `https://social-network.samuraijs.com/api/1.1/`,
    withCredentials: true,
    headers: {
        'API-KEY': 'ecad3ae6-8083-4154-b722-6cea4b99f288'
    }
})

export const authAPI = {
    login(data: LoginParamsType) {
        return axiosInstance.post<LoginParamsType, AxiosResponse<ResponseType<{userId: number}>>>(`auth/login`, data).then(res => res.data)
    },
    me() {
        return axiosInstance.get<ResponseType<LoggedUserDataType>>(`auth/me`)
    },
    logout() {
        return axiosInstance.delete<ResponseType>(`auth/login`)
    },
}

export type LoggedUserDataType = {
    id: number,
    login: string,
    email: string,
}

export type LoginParamsType = {
    email: string,
    password: string,
    rememberMe?: boolean,
    captcha?: string,
}