import {TaskActionType, tasksReducer} from './tasks-reducer';
import {TodoActionType, todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction} from 'redux-thunk';
import {TypedUseSelectorHook, useSelector} from 'react-redux';
import {AppActionType, appReducer} from './app-reducer';
import {AuthActionsType, authReducer} from './auth-reducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

type AppRootActionType = TodoActionType | TaskActionType | AppActionType | AuthActionsType
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type ThunkType = ThunkAction<void, AppRootStateType, unknown, AppRootActionType>

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;
