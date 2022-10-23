import { authAPI, LoggedUserDataType } from '../api/auth-api';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, put } from 'redux-saga/effects';
import { setUserData } from './auth-reducer';
import { AxiosResponse } from 'axios';
import { ResponseType } from '../api/todolist-api';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export function* initAppSaga() {
  put(setAppStatus({ status: 'loading' }));
  // try {
  let res: AxiosResponse<ResponseType<LoggedUserDataType>> = yield call(authAPI.me);
  if (res.data.resultCode === 0) {
    yield put(setUserData(res.data.data.login));
  }
  yield put(setIsInit());
  // }
  // } else {
  // handleServerAppError(res.data, put);
  // }
  // } catch (e: any) {
  // handleServerNetworkError(e, put);
  // } finally {
  //   yield put(setIsInit());
  // }
}

const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInit: false
};

export type AppInitStateType = typeof initialState

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status;
    },
    setAppError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setIsInit(state) {
      state.isInit = true;
    },
    initApp() { }
  }
});

export const appReducer = slice.reducer;
export const { setAppStatus, setAppError, setIsInit, initApp } = slice.actions;

