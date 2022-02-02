import {ThunkType} from './store';
import {todolistApi, TodoType} from '../api/todolist-api';
import {RequestStatusType, setAppStatus} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {getTasksTC} from './tasks-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type FilterValuesType = "all" | "active" | "completed";
export type TodoDomainType = TodoType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: TodoDomainType[] = []

const slice = createSlice({
    name: 'todo',
    initialState: initialState,
    reducers: {
        removeTodo(state, action: PayloadAction<string>) {
            return state.filter(tl => tl.id !== action.payload)
        },
        addTodo(state, action: PayloadAction<TodoType>) {
            state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
        },
        setTodo(state, action: PayloadAction<TodoType[]>) {
            return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodoTitle(state, action: PayloadAction<{ title: string, todoId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].title = action.payload.title
        },
        changeTodoFilter(state, action: PayloadAction<{ todoId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        changeTlEntity(state, action: PayloadAction<{ todoId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.entityStatus
        },
        clearTodoData(state) {
            return []
        }
    }
})

export const todolistsReducer = slice.reducer
export const {
    addTodo,
    setTodo,
    changeTodoFilter,
    changeTodoTitle,
    changeTlEntity,
    clearTodoData,
    removeTodo
} = slice.actions

// THUNK

export const getTodoTC = (): ThunkType =>
    (dispatch, getState) => {
        dispatch(setAppStatus({status: 'loading'}))
        todolistApi.getTLs()
            .then(res => {
                if (res.data) {
                    dispatch(setTodo(res.data))
                    return res.data
                }
            })
            .then(todos => {
                if (todos) {
                    todos.forEach(tl => dispatch(getTasksTC(tl.id)))
                    dispatch(setAppStatus({status: 'idle'}))
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const removeTodoTC = (todoId: string): ThunkType =>
    (dispatch) => {
        dispatch(changeTlEntity({todoId, entityStatus: 'loading'}))
        dispatch(setAppStatus({status: 'loading'}))
        todolistApi.deleteTL(todoId)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(removeTodo(todoId))
                    dispatch(setAppStatus({status: 'idle'}))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const createTodoTC = (title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        todolistApi.createTL(title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(addTodo(res.data.item))
                    dispatch(setAppStatus({status: 'idle'}))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }

export const changeTodoTitleTC = (todoId: string, title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        todolistApi.updateTLTitle(todoId, title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(changeTodoTitle({title, todoId}))
                    dispatch(setAppStatus({status: 'idle'}))
                } else {
                    handleServerAppError(res, dispatch)
                }
            })
            .catch(err => handleServerNetworkError(err, dispatch))
    }