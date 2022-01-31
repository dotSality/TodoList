import {TaskModelType, tasksAPI, TaskStatuses, TaskType} from '../api/tasks-api';
import {addTodo, clearTodoData, removeTodo, setTodo} from './todolists-reducer';
import {ThunkType} from './store';
import {setAppError, setAppStatus} from './app-reducer';
import {handleServerNetworkError} from '../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type TasksStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTask(state, action: PayloadAction<{ taskId: string, todoId: string }>) {
            const tasks = state[action.payload.todoId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks.splice(index, 1)
        },
        addTask(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask(state, action: PayloadAction<{ taskId: string, model: TaskModelType, todoId: string }>) {
            let tasks = state[action.payload.todoId]
            let index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model}
        },
        changeTaskTitle(state, action: PayloadAction<{ taskId: string, title: string, todoId: string }>) {
            let tasks = state[action.payload.todoId]
            let index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) tasks[index].title = action.payload.title
        },
        setTasks(state, action: PayloadAction<{ todoId: string, tasks: TaskType[] }>) {
            state[action.payload.todoId] = action.payload.tasks
        }
    },
    extraReducers: builder => {
        builder.addCase(addTodo, (state, action) => {
            state[action.payload.todo.id] = []
        });
        builder.addCase(setTodo, (state, action) => {
            action.payload.todos.forEach(tl => state[tl.id] = [])
        });
        builder.addCase(removeTodo, (state, action) => {
            delete state[action.payload.todoId]
        });
        builder.addCase(clearTodoData, (state, action) => {
            return {}
        });
    }
})

export const tasksReducer = slice.reducer

export const {
    changeTaskTitle, removeTask, setTasks, updateTask, addTask
} = slice.actions

// THUNK

export const getTasksTC = (tlId: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        tasksAPI.getTasks(tlId)
            .then(res => {
                dispatch(setTasks({todoId: tlId, tasks: res.items}))
            })
    }

export const deleteTaskTC = (tlId: string, taskId: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        tasksAPI.deleteTask(tlId, taskId)
            .then(res => {
                dispatch(removeTask({taskId: taskId, todoId: tlId}))
                dispatch(setAppStatus({status: 'idle'}))
            })
    }

export const createTaskTC = (tlId: string, title: string): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatus({status: 'loading'}))
        tasksAPI.createTask(tlId, title)
            .then(res => {
                if (res.resultCode === 0) {
                    dispatch(addTask({task: res.data.item}))
                    dispatch(setAppStatus({status: 'idle'}))
                } else {
                    if (res.messages.length) {
                        dispatch(setAppError({error: res.messages[0]}))
                    } else {
                        dispatch(setAppError({error: 'Some error occured'}))
                    }
                    dispatch(setAppStatus({status: 'failed'}))
                }
            })
            .catch(err => {
                dispatch(setAppError({error: err.message}))
                dispatch(setAppStatus({status: 'failed'}))
            })
    }

export const updateTaskStatusTC = (todoId: string, taskId: string, status: TaskStatuses): ThunkType => {
    return (dispatch, getState) => {
        dispatch(setAppStatus({status: 'loading'}))
        const task = getState().tasks[todoId].find(t => t.id === taskId)
        if (task) {
            let model: TaskModelType = {...task, status}
            tasksAPI.updateTask(todoId, taskId, model)
                .then(res => {
                    dispatch(updateTask({taskId, model, todoId}))
                    dispatch(setAppStatus({status: 'idle'}))
                })
                .catch(err => {
                    handleServerNetworkError(err, dispatch)
                })

        }
    }
}

export const changeTaskTitleTC = (todoId: string, taskId: string, title: string): ThunkType => {
    return (dispatch, getState) => {
        dispatch(setAppStatus({status: 'loading'}))
        const task = getState().tasks[todoId].find(t => t.id === taskId)

        if (task) {
            let model: TaskModelType = {...task, title}
            tasksAPI.updateTask(todoId, taskId, model)
                .then(res => {
                    dispatch(updateTask({taskId, model, todoId}))
                    dispatch(setAppStatus({status: 'idle'}))
                })
                .catch(err => {
                    handleServerNetworkError(err, dispatch)
                })
        }
    }
}