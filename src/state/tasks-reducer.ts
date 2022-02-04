import {TaskModelType, tasksAPI, TaskType} from '../api/tasks-api';
import {addTodo, clearTodoData, removeTodo, setTodo} from './todolists-reducer';
import {ThunkType} from './store';
import {setAppStatus} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (tlId: string, {dispatch}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await tasksAPI.getTasks(tlId)
        dispatch(setAppStatus({status: 'succeeded'}))
        return {todoId: tlId, tasks: res.items}
    } catch (e: any) {
        handleServerNetworkError(e.message, dispatch)
        dispatch(setAppStatus({status: 'failed'}))
    }
})

export const deleteTask = createAsyncThunk('tasks/deleteTask',
    async (params: { tlId: string, taskId: string }, {dispatch}) => {
    dispatch(setAppStatus({status: 'loading'}))
    let {tlId, taskId} = params
    try {
        let res = await tasksAPI.deleteTask(tlId, taskId)
        if (res.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return params
        } else {
            dispatch(setAppStatus({status: 'failed'}))
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e.message, dispatch)
        dispatch(setAppStatus({status: 'failed'}))
    }
})

export const createTask = createAsyncThunk('tasks/createTask',
    async (params: { tlId: string, title: string }, {dispatch}) => {
    let {tlId, title} = params
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await tasksAPI.createTask(tlId, title)
        if (res.resultCode === 0) {
            dispatch(setAppStatus({status: 'idle'}))
            return res.data.item
        } else handleServerAppError(res, dispatch)
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
})

// export const updateTask = createAsyncThunk('tasks/updateTask',
//     async (params: {todoId: string, taskId: string, model: TaskModelType}, thunkAPI) => {
//     let {taskId, model, todoId} = params
//         thunkAPI.dispatch(setAppStatus({status: 'loading'}))
//         let state = thunkAPI.getState()
//         const task = state.tasks[todoId].find(t => t.id === taskId)
//         if (task) {
//             let newTask: TaskModelType = {...task, ...model}
//             tasksAPI.updateTask(todoId, taskId, model)
//                 .then(res => {
//                     thunkAPI.dispatch(updateTask({taskId, newTask, todoId}))
//                     thunkAPI.dispatch(setAppStatus({status: 'idle'}))
//                 })
//                 .catch(err => {
//                     handleServerNetworkError(err, thunkAPI.dispatch)
//                 })
//         }
//     })

export const updateTaskTC = (todoId: string, taskId: string, model: TaskModelType): ThunkType => {
    return (dispatch, getState) => {
        dispatch(setAppStatus({status: 'loading'}))
        const task = getState().tasks[todoId].find(t => t.id === taskId)
        if (task) {
            let newTask: TaskModelType = {...task, ...model}
            tasksAPI.updateTask(todoId, taskId, model)
                .then(res => {
                    dispatch(updateTask({taskId, newTask, todoId}))
                    dispatch(setAppStatus({status: 'idle'}))
                })
                .catch(err => {
                    handleServerNetworkError(err, dispatch)
                })

        }
    }
}

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        updateTask(state, action: PayloadAction<{ taskId: string, newTask: TaskModelType, todoId: string }>) {
            let tasks = state[action.payload.todoId]
            let index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], ...action.payload.newTask}
        },
        changeTaskTitle(state, action: PayloadAction<{ taskId: string, title: string, todoId: string }>) {
            let tasks = state[action.payload.todoId]
            let index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index].title = action.payload.title
        },
    },
    extraReducers: builder => {
        builder.addCase(addTodo, (state, action) => {
            state[action.payload.id] = []
        });
        builder.addCase(setTodo, (state, action) => {
            action.payload.forEach(tl => state[tl.id] = [])
        });
        builder.addCase(removeTodo, (state, action) => {
            delete state[action.payload]
        });
        builder.addCase(clearTodoData, (state, action) => {
            return {}
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            if (action.payload) state[action.payload.todoId] = action.payload.tasks
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.tlId]
                const index = tasks.findIndex(t => action.payload && t.id === action.payload.taskId)
                if (index > -1) tasks.splice(index, 1)
            }
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            if (action.payload) state[action.payload.todoListId].unshift(action.payload)
        })
    }
})

export const tasksReducer = slice.reducer

export const {changeTaskTitle, updateTask} = slice.actions

// THUNK
