import {ResponseType} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {setAppError, setAppStatus} from '../state/app-reducer';

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppError({error: data.messages[0]}))
    } else {
        dispatch(setAppError({error: 'Some error occured'}))
    }
    dispatch(setAppStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setAppError({error: error.message}))
    dispatch(setAppStatus({status: 'failed'}))
}