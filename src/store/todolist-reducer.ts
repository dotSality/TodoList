import {FilterValuesType, TodoListType} from '../App';
import {v1} from 'uuid';

export type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST',
    id: string
}

export type AddTodoListAT = {
    type: 'ADD-TODOLIST',
    title: string
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

export const RemoveTodolistAC = (id: string) :RemoveTodoListAT => ({type: 'REMOVE-TODOLIST', id})

export const AddTlAC = (title: string) :AddTodoListAT => ({type: 'ADD-TODOLIST', title})

export const ChangeTlTitleAC = (title: string, id: string) :ChangeTlTitleAT => ({type: 'CHANGE-TODOLIST-TITLE', title, id})

export const ChangeTlFilterAC = (filter: FilterValuesType, id: string) :ChangeTLFilterAT => ({type: 'CHANGE-FILTER', filter, id})

export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTlTitleAT | ChangeTLFilterAT

export const todolistReducer = (todoLists: TodoListType[], action: ActionType):TodoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return todoLists.filter(tl => tl.id !== action.id);
        case 'ADD-TODOLIST':
            let newTodolist: TodoListType = {
                id: v1(),
                title: action.title,
                filter: 'all'
            }
            return [newTodolist, ...todoLists];
        case 'CHANGE-TODOLIST-TITLE':
            return [...todoLists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)];
        case 'CHANGE-FILTER':
            return [...todoLists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)]
        default:
            return todoLists;
    }
}