import { fetchTasks, fetchTasksSaga, setTasks, tasksReducer } from './tasks-reducer';
import { fetchRemoveTodo, fetchTodos, fetchTodosSaga, removeTodo, removeTodoSaga, todolistsReducer } from './todolists-reducer';
import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { appReducer, initApp, initAppSaga } from './app-reducer';
import { authReducer } from './auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { takeEvery } from 'redux-saga/effects';

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(sagaMiddleware)
});

export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>();

export type RootStateType = ReturnType<typeof rootReducer>

function* rootWatcher() {
  yield takeEvery(initApp.type, initAppSaga);
  yield takeEvery(fetchTasks.type, fetchTasksSaga);
  yield takeEvery(fetchTodos.type, fetchTodosSaga);
  yield takeEvery(fetchRemoveTodo.type, removeTodoSaga);
}

setTimeout(() => {
  store.dispatch({ type: 'ACTIVATOR_ACTION_TYPE' });
}, 2000);

sagaMiddleware.run(rootWatcher);

// @ts-ignore
window.store = store;
