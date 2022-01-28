import {TaskModelType, tasksAPI, TaskStatuses, TaskType} from '../api/tasks-api';
import {ClearTodoDataAT, RemoveTodoListAT, setTodoAT} from './todolists-reducer';
import {ThunkType} from './store';
import {setAppErrorAC, setAppStatusAC} from './app-reducer';
import {handleServerNetworkError} from '../utils/error-utils';

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>
export type AddTaskAT = ReturnType<typeof addTaskAC>
export type updateTaskAT = ReturnType<typeof updateTaskAC>
export type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
export type SetTasksAT = ReturnType<typeof setTasksAC>

export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'TASKS/REMOVE-TASK', taskID, todolistID} as const)
export const addTaskAC = (task: TaskType) => ({type: 'TASKS/ADD-TASK', task} as const)
export const updateTaskAC = (taskID: string, model: TaskModelType, todolistID: string) => ({type: 'TASKS/UPDATE-TASK', taskID, model, todolistID} as const)
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => ({type: 'TASKS/CHANGE-TITLE', taskID, title, todolistID} as const)
export const setTasksAC = (tlId: string, tasks: TaskType[]) => ({type: 'TASKS/SET-TASKS', tasks, tlId} as const)

export type TaskActionType = RemoveTaskAT
    | AddTaskAT
    | updateTaskAT
    | ChangeTaskTitleAT
    | setTodoAT
    | RemoveTodoListAT
    | SetTasksAT
    | ClearTodoDataAT

type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TaskActionType): TasksStateType => {
    switch (action.type) {
        case 'TASKS/REMOVE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)};
        case 'TASKS/ADD-TASK': {
            let copy = {...state}
            let tasks = copy[action.task.todoListId]
            copy[action.task.todoListId] = [action.task, ...tasks]
            return copy
        }
        case 'TASKS/UPDATE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => action.taskID === t.id ? {...t, ...action.model} : t)}
        case 'TASKS/CHANGE-TITLE':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'TODO/SET-TODO': {
            let copy = {...state}
            action.todolists.forEach(tl => copy[tl.id] = [])
            return copy
        }
        case 'TASKS/SET-TASKS':
            return {...state, [action.tlId]: action.tasks}
        case 'TODO/REMOVE-TODO': {
            let stateCopy = {...state}
            delete stateCopy[action.todolistID]
            return stateCopy
        }
        case 'TODO/CLEAR-DATA':
            return {};
        default:
            return state;
    }
}

// THUNK

export const getTasksTC = (tlId: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        tasksAPI.getTasks(tlId)
            .then(res => {
                dispatch(setTasksAC(tlId, res.items))
            })
    }

export const deleteTaskTC = (tlId: string, taskId: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        tasksAPI.deleteTask(tlId, taskId)
            .then(res => {
                dispatch(removeTaskAC(taskId, tlId))
                dispatch(setAppStatusAC('idle'))
            })
    }

export const createTaskTC = (tlId: string, title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        tasksAPI.createTask(tlId, title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(addTaskAC(res.data.item))
                    dispatch(setAppStatusAC('idle'))
                } else {
                    if (res.messages.length) {
                        dispatch(setAppErrorAC(res.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some error occured'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch(err => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
            })
    }

export const updateTaskStatusTC = (tlId: string, taskId: string, status: TaskStatuses): ThunkType => {
    return (dispatch, getState) => {
        dispatch(setAppStatusAC('loading'))
        const task = getState().tasks[tlId].find(t => t.id === taskId)

        if (task) {
            let model: TaskModelType = {...task, status}
            tasksAPI.updateTask(tlId, taskId, model)
                .then(res => {
                    dispatch(updateTaskAC(taskId, model, tlId))
                    dispatch(setAppStatusAC('idle'))
                })
                .catch(err => {
                    handleServerNetworkError(err, dispatch)
                })

        }
    }
}

export const changeTaskTitleTC = (tlId: string, taskId: string, title: string): ThunkType => {
    return (dispatch, getState) => {
        dispatch(setAppStatusAC('loading'))
        const task = getState().tasks[tlId].find(t => t.id === taskId)

        if (task) {
            let model: TaskModelType = {...task, title}
            tasksAPI.updateTask(tlId, taskId, model)
                .then(res => {
                    dispatch(updateTaskAC(taskId, model, tlId))
                    dispatch(setAppStatusAC('idle'))
                })
                .catch(err => {
                    handleServerNetworkError(err, dispatch)
                })
        }
    }
}