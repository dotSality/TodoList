import {tasksReducer} from './tasks-reducer';
import {todolistsReducer} from './todolists-reducer';
import {AnyAction, combineReducers} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {appReducer} from './app-reducer';
import {authReducer} from './auth-reducer';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AnyAction>

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
