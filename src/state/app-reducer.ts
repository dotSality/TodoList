import {authAPI} from '../api/auth-api';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initApp = createAsyncThunk('app/initApp', async (_, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) return {login: res.data.data.login}
        else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({})
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue({})
    } finally {
        dispatch(setIsInit({isInit: true}))
    }
})

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInit: false
}

export type AppInitStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setIsInit(state, action: PayloadAction<{ isInit: boolean }>) {
            state.isInit = action.payload.isInit
        }
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError, setIsInit} = slice.actions

