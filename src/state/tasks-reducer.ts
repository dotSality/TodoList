import {TaskModelType, tasksAPI, TaskStatuses, TaskType} from '../api/tasks-api';
import {RemoveTodoListAT, setTodoAT} from './todolists-reducer';
import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './store';

export type RemoveTaskAT = ReturnType<typeof removeTaskAC>
export type AddTaskAT = ReturnType<typeof addTaskAC>
export type updateTaskAT = ReturnType<typeof updateTaskAC>
export type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
export type SetTasksAT = ReturnType<typeof setTasksAC>

export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'REMOVE-TASK', taskID, todolistID} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskID: string, model: TaskModelType, todolistID: string) => ({type: 'UPDATE-TASK', taskID, model, todolistID} as const)
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => ({type: 'CHANGE-TITLE', taskID, title, todolistID} as const)
export const setTasksAC = (tlId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', tasks, tlId} as const)

export type TaskActionType = RemoveTaskAT
    | AddTaskAT
    | updateTaskAT
    | ChangeTaskTitleAT
    | setTodoAT
    | RemoveTodoListAT
    | SetTasksAT

type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: TaskActionType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)};
        case 'ADD-TASK': {
            let copy = {...state}
            let tasks = copy[action.task.todoListId]
            copy[action.task.todoListId] = [action.task, ...tasks]
            return copy
        }
        case 'UPDATE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => action.taskID === t.id ? {...t, ...action.model} : t)}
        case 'CHANGE-TITLE':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'SET-TODO': {
            let copy = {...state}
            action.todolists.forEach(tl => copy[tl.id] = [])
            return copy
        }
        case 'SET-TASKS':
            return {...state, [action.tlId]: action.tasks}
        case 'REMOVE-TODO': {
            let stateCopy = {...state}
            delete stateCopy[action.todolistID]
            return stateCopy
        }
        default:
            return state;
    }
}

// THUNK
type ThunkType = ThunkAction<void, AppRootStateType, unknown, TaskActionType>

export const getTasksTC = (tlId: string): ThunkType => (dispatch) => {
    tasksAPI.getTasks(tlId)
        .then(res => dispatch(setTasksAC(tlId, res.items)))
}

export const deleteTaskTC = (tlId: string, taskId: string): ThunkType => (dispatch) => {
    tasksAPI.deleteTask(tlId, taskId)
        .then(res => dispatch(removeTaskAC(taskId, tlId)))
}

export const createTaskTC = (tlId: string, title: string): ThunkType => (dispatch) => {
    tasksAPI.createTask(tlId, title)
        .then(res => dispatch(addTaskAC(res.item)))
}

export const updateTaskStatusTC = (tlId: string, taskId: string, status: TaskStatuses): ThunkType => {
   return (dispatch, getState) => {
       const tasksFromCurrentTodo = getState().tasks[tlId]
       const task = tasksFromCurrentTodo.find(t => t.id === taskId)

       if (task) {
           let model: TaskModelType = {...task, status}
           tasksAPI.updateTask(tlId, taskId, model)
               .then(res => dispatch(updateTaskAC(taskId, model, tlId)))
       }
    }
}

export const changeTaskTitleTC = (tlId: string, taskId: string, title: string): ThunkType => {
    return (dispatch, getState) => {
        const task = getState().tasks[tlId].find(t => t.id === taskId)

        if(task) {
            let model: TaskModelType = {...task, title}
            tasksAPI.updateTask(tlId, taskId, model)
                .then(res => dispatch(updateTaskAC(taskId, model, tlId)))
        }
    }
}