import {TaskModelType, tasksAPI, TaskType} from '../api/tasks-api';
import {createTodo, fetchTodos, removeTodo} from './todolists-reducer';
import {RootStateType} from './store';
import {setAppStatus} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {logout} from './auth-reducer';

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

type UpdatePayloadType = {
    todoId: string,
    taskId: string,
    model: TaskModelType,
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (tlId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            let res = await tasksAPI.getTasks(tlId)
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todoId: tlId, tasks: res.items}
        } catch (e: any) {
            handleServerNetworkError(e.message, dispatch)
            return rejectWithValue({})
        }
    })

export const deleteTask = createAsyncThunk('tasks/deleteTask',
    async ({tlId, taskId}: { tlId: string, taskId: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            let res = await tasksAPI.deleteTask(tlId, taskId)
            if (res.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return {tlId, taskId}
            } else {
                handleServerAppError(res, dispatch)
                return rejectWithValue({})
            }
        } catch (e: any) {
            handleServerNetworkError(e.message, dispatch)
            return rejectWithValue({})
        }
    })

export const createTask = createAsyncThunk('tasks/createTask',
    async ({tlId, title}: { tlId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            let res = await tasksAPI.createTask(tlId, title)
            if (res.resultCode === 0) {
                dispatch(setAppStatus({status: 'idle'}))
                return res.data.item
            } else {
                handleServerAppError(res, dispatch)
                return rejectWithValue({})
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue({})
        }
    })

export const updateTask = createAsyncThunk<UpdatePayloadType | undefined, UpdatePayloadType, { state: RootStateType }>
('tasks/updateTask',
    async ({todoId, taskId, model}: UpdatePayloadType,
           {dispatch, getState, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const task = getState().tasks[todoId].find(t => t.id === taskId)
            if (task) {
                let newTask: TaskModelType = {...task, ...model}
                let res = await tasksAPI.updateTask(todoId, taskId, newTask)
                if (res.resultCode === 0) {
                    dispatch(setAppStatus({status: 'idle'}))
                    return {taskId, model: newTask, todoId}
                } else {
                    handleServerAppError(res, dispatch)
                    return rejectWithValue(undefined)
                }
            }
        } catch (err: any) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(undefined)
        }
    })

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(createTodo.fulfilled, (state, action) => {
            state[action.payload.id] = []
        });
        builder.addCase(fetchTodos.fulfilled, (state, action) => {
            action.payload.forEach(tl => state[tl.id] = [])
        });
        builder.addCase(removeTodo.fulfilled, (state, action) => {
            delete state[action.payload]
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            return {}
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.tlId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            if (action.payload) {
                let tasks = state[action.payload.todoId]
                let index = tasks.findIndex(t => t.id === action.payload!.taskId)
                if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})

export const tasksReducer = slice.reducer