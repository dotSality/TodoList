import {ThunkType} from './store';
import {authAPI, LoginParamsType} from './auth-api';
import {setAppStatusAC} from './app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {clearTodoDataAC} from './todolists-reducer';

const initState = {
    isLoggedIn: false,
    login: null as string | null,
}

type InitStateType = typeof initState

export const authReducer = (state = initState, action: AuthActionsType): InitStateType => {
    switch (action.type) {
        case 'AUTH/SET-LOGGED':
            return {...state, isLoggedIn: action.isLoggedIn}
        case 'AUTH/SET-LOGIN':
            return {...state, login: action.login}
        default:
            return state
    }
}

export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        let res = await authAPI.login(data)
        console.log(res)
        if (res.resultCode === 0) {
            dispatch(setIsLoggedIn(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res, dispatch)
            dispatch(setAppStatusAC('failed'))
        }
    } catch (err: any) {
        handleServerNetworkError(err, dispatch)
    }
}

export const logoutTC = (): ThunkType => async (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    try {
        let res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setUserLogin(null))
            dispatch(clearTodoDataAC())
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(setAppStatusAC('failed'))
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const setIsLoggedIn = (isLoggedIn: boolean) => ({type: 'AUTH/SET-LOGGED', isLoggedIn} as const)
export const setUserLogin = (login: string | null) => ({type: 'AUTH/SET-LOGIN', login} as const)

type SetIsLoggedInAT = ReturnType<typeof setIsLoggedIn>
type SetLoginAT = ReturnType<typeof setUserLogin>

export type AuthActionsType = SetIsLoggedInAT | SetLoginAT