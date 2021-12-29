import {FilterValuesType, TodoListType} from '../App';
import {v1} from 'uuid';

export type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST',
    todolistID: string
}

export type AddTodoListAT = {
    type: 'ADD-TODOLIST',
    title: string,
    todolistId: string
}

type ChangeTlTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE',
    title: string,
    id: string
}

type ChangeTLFilterAT = {
    type: 'CHANGE-FILTER',
    filter: FilterValuesType,
    id: string
}

export const removeTodolistAC = (todolistID: string) :RemoveTodoListAT => ({type: 'REMOVE-TODOLIST', todolistID})

export const addTlAC = (title: string) :AddTodoListAT => ({type: 'ADD-TODOLIST', title, todolistId: v1()})

export const changeTlTitleAC = (title: string, id: string) :ChangeTlTitleAT => ({type: 'CHANGE-TODOLIST-TITLE', title, id})

export const changeTlFilterAC = (filter: FilterValuesType, id: string) :ChangeTLFilterAT => ({type: 'CHANGE-FILTER', filter, id})

export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTlTitleAT | ChangeTLFilterAT

const initialState: TodoListType[] = []

export const todolistsReducer = (state = initialState, action: ActionType):TodoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistID);
        case 'ADD-TODOLIST':
            let newTodolist: TodoListType = {
                id: action.todolistId,
                title: action.todolistId,
                filter: 'all'
            }
            return [newTodolist, ...state];
        case 'CHANGE-TODOLIST-TITLE':
            return [...state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)];
        case 'CHANGE-FILTER':
            return [...state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)]
        default:
            return state;
    }
}