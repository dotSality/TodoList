import {ThunkAction} from 'redux-thunk';
import {AppRootStateType, ThunkType} from './store';
import {todolistApi, TodoType} from '../api/todolist-api';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';

export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type setTodoAT = ReturnType<typeof setTodoAC>
type ChangeTodoTitleAT = ReturnType<typeof changeTodoTitleAC>
type ChangeTodoFilterAT = ReturnType<typeof changeTodoFilterAC>
type AddTodoAT = ReturnType<typeof addTodoAC>
type ChangeEntityType = ReturnType<typeof changeTlEntityAC>

export const removeTodolistAC = (todolistID: string) => ({type: 'TODO/REMOVE-TODO', todolistID} as const)
export const addTodoAC = (title: string, todo: TodoDomainType) => ({type: 'TODO/ADD-TODO', title, todo} as const)
export const setTodoAC = (todolists: TodoDomainType[]) => ({type: 'TODO/SET-TODO', todolists} as const)
export const changeTodoTitleAC = (title: string, id: string) => ({type: 'TODO/CHANGE-TODO-TITLE', title, id} as const)
export const changeTodoFilterAC = (filter: FilterValuesType, id: string) => ({type: 'TODO/CHANGE-FILTER', filter, id} as const)
export const changeTlEntityAC = (tlId: string, entityStatus: RequestStatusType) =>
    ({type: 'TODO/CHANGE-ENTITY', tlId, entityStatus} as const)

export type TodoActionType = RemoveTodoListAT | setTodoAT | ChangeTodoTitleAT
    | ChangeTodoFilterAT | AddTodoAT | ChangeEntityType

export type FilterValuesType = "all" | "active" | "completed";
export type TodoDomainType = TodoType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: TodoDomainType[] = []

export const todolistsReducer = (state = initialState, action: TodoActionType): TodoDomainType[] => {
    switch (action.type) {
        case 'TODO/REMOVE-TODO':
            return state.filter(tl => tl.id !== action.todolistID);
        case 'TODO/SET-TODO':
            return action.todolists.map(tl => ({...tl, filter: 'all'}));
        case 'TODO/ADD-TODO':
            return [{...action.todo, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'TODO/CHANGE-TODO-TITLE':
            return [...state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)];
        case 'TODO/CHANGE-FILTER':
            return [...state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)]
        case 'TODO/CHANGE-ENTITY':
            return state.map(tl => tl.id === action.tlId ? {...tl, entityStatus: action.entityStatus} : tl)
        default:
            return state;
    }
}

// THUNK

export const getTodoTC = (): ThunkType =>
    (dispatch, getState) => {
        dispatch(setAppStatusAC('loading'))
        todolistApi.getTLs()
            .then(res => {
                if(res) {
                    dispatch(setTodoAC(res))
                    dispatch(setAppStatusAC('idle'))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const removeTodoTC = (tlId: string): ThunkType =>
    (dispatch) => {
        dispatch(changeTlEntityAC(tlId, 'loading'))
        dispatch(setAppStatusAC('loading'))
        todolistApi.deleteTL(tlId)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(removeTodolistAC(tlId))
                    dispatch(setAppStatusAC('idle'))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const createTodoTC = (title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistApi.createTL(title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(addTodoAC(title, res.data.item))
                    dispatch(setAppStatusAC('idle'))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const changeTodoTitleTC = (tlId: string, title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistApi.updateTLTitle(tlId, title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(changeTodoTitleAC(title, tlId))
                    dispatch(setAppStatusAC('idle'))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }