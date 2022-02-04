import {ThunkType} from './store';
import {authAPI} from '../api/auth-api';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {setIsLoggedIn, setUserLogin} from './auth-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

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

export const initAppTC = (): ThunkType => async (dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        let res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setUserLogin({login: res.data.data.login}))
            dispatch(setIsLoggedIn({isLoggedIn: true}))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatus({status: 'failed'}))
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setIsInit({isInit: true}))
    }
}