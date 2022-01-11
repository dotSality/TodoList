import {useEffect, useState} from 'react';
import {tasksAPI, TaskType} from '../api/tasks-api';

export default {
    title: 'API/Tasks'
}

export const GetTasks = () => {
    const [state, setState] = useState(null)
    useEffect(() => {
        let tlId = 'c21f1f1e-add7-4501-845f-2cd3eca8fbb8'
        tasksAPI.getTasks(tlId).then(res => setState(res))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState(null)
    useEffect(() => {
        let tlId = 'c21f1f1e-add7-4501-845f-2cd3eca8fbb8'
        let taskTitle = '11111'
        tasksAPI.createTask(tlId, taskTitle).then(res => setState(res))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState(null)
    useEffect(() => {
        let tlId = 'c21f1f1e-add7-4501-845f-2cd3eca8fbb8'
        let taskId = '539bca86-fd55-4c74-bf3b-63613d5ed6b7'
        tasksAPI.deleteTask(tlId, taskId).then(res => setState(res))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState(null)
    useEffect(() => {
        let tlId = 'c21f1f1e-add7-4501-845f-2cd3eca8fbb8'
        let taskId = '3e3c27a3-30c2-42ba-aa2b-4581e6c9860b'
        let task: TaskType = {
            title: 'HUILO',
            deadline: '',
            startDate: '',
            status: 0,
            priority: 1,
            description: '',
        }
        tasksAPI.updateTask(tlId, taskId, task).then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}