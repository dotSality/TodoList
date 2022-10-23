import { ResponseType, todolistApi, TodoType } from '../api/todolist-api';
import { RequestStatusType, setAppStatus } from './app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { fetchTasks } from './tasks-reducer';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './auth-reducer';
import { all, call, put } from 'redux-saga/effects';

export type FilterValuesType = "all" | "active" | "completed";
export type TodoDomainType = TodoType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

export function* fetchTodosSaga() {
  yield put(setAppStatus({ status: 'loading' }));
  let res: TodoDomainType[] = yield call(todolistApi.getTLs);
  if (res) {
    yield all(res.map(tl => put(fetchTasks({ todoId: tl.id }))));
    yield put(setTodos(res));
  }
}

export function* removeTodoSaga(action: ReturnType<typeof fetchRemoveTodo>) {
  yield put(changeTlEntity({ todoId: action.payload.todoId, entityStatus: 'loading' }));
  yield put(setAppStatus({ status: 'loading' }));
  let res: ResponseType = yield call(todolistApi.deleteTL, action.payload.todoId);
  if (res.resultCode === 0) {
    yield put(setAppStatus({ status: 'idle' }));
    yield put(removeTodo(action.payload.todoId));
  }
}

export const createTodo = createAsyncThunk('todo/createTodo', async (title: string, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    let res = await todolistApi.createTL(title);
    if (res.resultCode === 0) {
      dispatch(setAppStatus({ status: 'idle' }));
      return res.data.item;
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue({});
    }
  } catch (err: any) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue({});
  }
});

export const changeTodoTitle = createAsyncThunk('todo/changeTodoTitle', async ({ todoId, title }: { todoId: string, title: string }, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    let res = await todolistApi.updateTLTitle(todoId, title);
    if (res.resultCode === 0) {
      dispatch(setAppStatus({ status: 'idle' }));
      return { title, todoId };
    } else {
      handleServerAppError(res, dispatch);
      return rejectWithValue({});
    }
  } catch (err: any) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue({});
  }
});

const slice = createSlice({
  name: 'todo',
  initialState: [] as TodoDomainType[],
  reducers: {
    changeTodoFilter(state, action: PayloadAction<{ todoId: string, filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todoId);
      if (index > -1) state[index].filter = action.payload.filter;
    },
    changeTlEntity(state, action: PayloadAction<{ todoId: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.todoId);
      if (index > -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodos(state, action: PayloadAction<TodoDomainType[]>) {
      return action.payload.map(tl => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
    },
    fetchTodos() {
    },
    fetchRemoveTodo(_, action: PayloadAction<{ todoId: string }>) {
    },
    removeTodo(state, action: PayloadAction<string>) {
      return state.filter(tl => tl.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(logout.fulfilled, state => {
      return [];
    });
    builder.addCase(createTodo.fulfilled, ((state, action) => {
      state.unshift({ ...action.payload, filter: 'all', entityStatus: 'idle' });
    }));
    builder.addCase(changeTodoTitle.fulfilled, ((state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload!.todoId);
      if (index > -1) state[index].title = action.payload.title;
    }));
  }
});

export const todolistsReducer = slice.reducer;
export const { changeTodoFilter, changeTlEntity, setTodos, fetchTodos, removeTodo, fetchRemoveTodo } = slice.actions;