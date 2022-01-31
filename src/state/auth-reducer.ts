import {ThunkType} from './store';
import {authAPI, LoginParamsType} from '../api/auth-api';
import {setAppStatus} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {clearTodoData} from './todolists-reducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initState = {
    isLoggedIn: false,
    login: null as string | null,
}

const slice = createSlice({
    name: 'auth',
    initialState: initState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
        setUserLogin(state, action: PayloadAction<{ login: string | null }>) {
            state.login = action.payload.login
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn, setUserLogin} = slice.actions

export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    try {
        let res = await authAPI.login(data)
        if (res.resultCode === 0) {
            dispatch(setIsLoggedIn({ isLoggedIn: true }))
            dispatch(setAppStatus({ status:'succeeded' }))
        } else {
            handleServerAppError(res, dispatch)
            dispatch(setAppStatus({ status: 'failed' }))
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
    }
}

export const logoutTC = (): ThunkType => async (dispatch) => {
    dispatch(setAppStatus({ status: 'loading' }))
    try {
        let res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({ isLoggedIn: false }))
            dispatch(setAppStatus({ status: 'succeeded' }))
            dispatch(setUserLogin({ login: null }))
            dispatch(clearTodoData())
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatus({ status: 'failed' }))
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}