import {TasksStateType, TaskType} from '../App';
import {v1} from 'uuid';
import {AddTodoListAT, RemoveTodoListAT} from './todolists-reducer';

export type RemoveTaskAT = {
    type: 'REMOVE-TASK',
    taskID: string,
    todolistID: string
}

export type AddTaskAT = {
    type: 'ADD-TASK',
    title: string,
    todolistID: string
}

export type ChangeTaskStatusAT = {
    type: 'CHANGE-STATUS',
    taskID: string,
    todolistID: string,
    isDone: boolean
}

export type ChangeTaskTitleAT = {
    type: 'CHANGE-TITLE',
    taskID: string,
    todolistID: string,
    title: string
}

export const removeTaskAC = (taskID: string, todolistID: string) :RemoveTaskAT =>
    ({type: 'REMOVE-TASK', taskID, todolistID})

export const addTaskAC = (title: string, todolistID: string) :AddTaskAT =>
    ({type: 'ADD-TASK', title, todolistID})

export const changeTaskStatusAC = (taskID: string, isDone: boolean, todolistID: string): ChangeTaskStatusAT =>
    ({type: 'CHANGE-STATUS', taskID, isDone, todolistID})

export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string): ChangeTaskTitleAT =>
    ({type: 'CHANGE-TITLE', taskID, title, todolistID})

export type ActionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodoListAT | RemoveTodoListAT

const initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionType):TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)};
        case 'ADD-TASK':
            const newTask: TaskType = {id: v1(), title: action.title, isDone: false}
            return {...state, [action.todolistID]: [newTask,...state[action.todolistID]]};
        case 'CHANGE-STATUS':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => action.taskID === t.id ? {...t, isDone: action.isDone} : t)}
        case 'CHANGE-TITLE':
            return {...state, [action.todolistID]: state[action.todolistID].map(t => t.id === action.taskID ? {...t, title: action.title} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            let stateCopy = {...state}
            delete stateCopy[action.todolistID]
            return stateCopy
        default:
            return state;
    }
}

