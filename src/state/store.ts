import {TaskActionType, tasksReducer} from './tasks-reducer';
import {TodoActionType, todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {AppActionType, appReducer} from './app-reducer';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

type AppRootActionType = TodoActionType | TaskActionType | AppActionType
export const useAppSelector: TypedUseSelectorHook<any> = useSelector
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AppRootActionType>

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
