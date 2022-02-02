import {tasksReducer} from '../../state/tasks-reducer';
import {combineReducers} from 'redux';
import {todolistsReducer} from '../../state/todolists-reducer';
import {appReducer} from '../../state/app-reducer';
import {authReducer} from '../../state/auth-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/tasks-api';
import {AppRootStateType} from '../../state/store';
import {v1} from 'uuid';
import {configureStore} from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {HashRouter} from 'react-router-dom';


const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", entityStatus: 'idle', addedDate: '', order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", entityStatus: 'loading', addedDate: '', order: 0}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
        ],
        ["todolistId2"]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
            },
        ]
    },
    app: {
        error: null,
        status: 'succeeded',
        isInit: true,
    },
    auth: {
        isLoggedIn: true,
        login: 'Sality',
    }
};

export const storybookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <HashRouter>
        <Provider store={storybookStore}>
            {storyFn()}
        </Provider>
    </HashRouter>
}