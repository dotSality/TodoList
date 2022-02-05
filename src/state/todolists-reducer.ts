import {todolistApi, TodoType} from '../api/todolist-api';
import {RequestStatusType, setAppStatus} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {fetchTasks} from './tasks-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {logout} from './auth-reducer';

export type FilterValuesType = "all" | "active" | "completed";
export type TodoDomainType = TodoType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const fetchTodos = createAsyncThunk('todo/getTodo', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await todolistApi.getTLs()
        if (res.data) {
            await res.data.forEach(tl => dispatch(fetchTasks(tl.id)))
            return res.data
        } else {
            return rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})

export const removeTodo = createAsyncThunk('todo/removeTodo', async (todoId: string, {dispatch, rejectWithValue}) => {
    dispatch(changeTlEntity({todoId, entityStatus: 'loading'}))
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await todolistApi.deleteTL(todoId)
        if (res.resultCode === 0) {
            dispatch(setAppStatus({status: 'idle'}))
            return todoId
        } else handleServerAppError(res, dispatch)
        return rejectWithValue({})
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})

export const createTodo = createAsyncThunk('todo/createTodo', async (title: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await todolistApi.createTL(title)
        if (res.resultCode === 0) {
            dispatch(setAppStatus({status: 'idle'}))
            return res.data.item
        } else {
            handleServerAppError(res, dispatch)
            return rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})

export const changeTodoTitle = createAsyncThunk('todo/changeTodoTitle', async ({todoId, title}: { todoId: string, title: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await todolistApi.updateTLTitle(todoId, title)
        if (res.resultCode === 0) {
            dispatch(setAppStatus({status: 'idle'}))
            return {title, todoId}
        } else {
            handleServerAppError(res, dispatch)
            return rejectWithValue({})
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
        return rejectWithValue({})
    }
})

const slice = createSlice({
    name: 'todo',
    initialState: [] as TodoDomainType[],
    reducers: {
        changeTodoFilter(state, action: PayloadAction<{ todoId: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].filter = action.payload.filter
        },
        changeTlEntity(state, action: PayloadAction<{ todoId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todoId)
            if (index > -1) state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(logout.fulfilled, state => {
            return []
        })
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            return action.payload.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(removeTodo.fulfilled, (state, action) => {
            return state.filter(tl => tl.id !== action.payload)
        })
        builder.addCase(createTodo.fulfilled, ((state, action) => {
            state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
        }))
        builder.addCase(changeTodoTitle.fulfilled, ((state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload!.todoId)
            if (index > -1) state[index].title = action.payload.title
        }))
    }
})

export const todolistsReducer = slice.reducer
export const {changeTodoFilter, changeTlEntity,} = slice.actions