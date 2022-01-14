import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './store';
import {todolistApi, TodoType} from '../api/todolist-api';

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type setTodoAT = ReturnType<typeof setTodoAC>
type ChangeTodoTitleAT = ReturnType<typeof changeTodoTitleAC>
type ChangeTodoFilterAT = ReturnType<typeof changeTodoFilterAC>
type AddTodoAT = ReturnType<typeof addTodoAC>

export const removeTodolistAC = (todolistID: string) => ({type: 'REMOVE-TODO', todolistID} as const)
export const addTodoAC = (title: string, todo: TodoDomainType) => ({type: 'ADD-TODO', title, todo} as const)
export const setTodoAC = (todolists: TodoDomainType[]) => ({type: 'SET-TODO', todolists} as const)
export const changeTodoTitleAC = (title: string, id: string) => ({type: 'CHANGE-TODO-TITLE', title, id} as const)
export const changeTodoFilterAC = (filter: FilterValuesType, id: string) => ({type: 'CHANGE-FILTER', filter, id} as const)

export type TodoActionType = RemoveTodoListAT | setTodoAT | ChangeTodoTitleAT | ChangeTodoFilterAT | AddTodoAT

export type FilterValuesType = "all" | "active" | "completed";
export type TodoDomainType = TodoType & {
    filter: FilterValuesType
}

const initialState: TodoDomainType[] = []

export const todolistsReducer = (state = initialState, action: TodoActionType):TodoDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODO':
            return state.filter(tl => tl.id !== action.todolistID);
        case 'SET-TODO':
            return action.todolists.map(tl => ({...tl, filter: 'all'}));
        case 'ADD-TODO':
            return [{...action.todo, filter: 'all'}, ...state]
        case 'CHANGE-TODO-TITLE':
            return [...state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)];
        case 'CHANGE-FILTER':
            return [...state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)]
        default:
            return state;
    }
}

// THUNK

type ThunkType = ThunkAction<void, AppRootStateType, unknown, TodoActionType>

export const getTodoTC = (): ThunkType => (dispatch, getState) => {
    todolistApi.getTLs()
        .then(res => dispatch(setTodoAC(res)))
}

export const removeTodoTC = (tlId: string): ThunkType => (dispatch) => {
    todolistApi.deleteTL(tlId)
        .then(res => dispatch(removeTodolistAC(tlId)))
}

export const createTodoTC = (title: string): ThunkType => (dispatch) => {
    todolistApi.createTL(title)
        // .then(res => dispatch(addTodoAC(title, res)))
        .then(res => dispatch(addTodoAC(title, res.item)))
}

export const changeTodoTitleTC = (tlId: string, title: string):ThunkType => (dispatch) => {
    todolistApi.updateTLTitle(tlId, title)
        .then(res => dispatch(changeTodoTitleAC(title, tlId)))
}