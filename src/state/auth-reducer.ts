import { authAPI, LoginParamsType } from '../api/auth-api';
import { initApp, setAppStatus } from './app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { FieldErrorsType } from '../api/todolist-api';

export const login = createAsyncThunk<undefined, LoginParamsType,
  { rejectValue: { errors: string[], fieldsErrors?: FieldErrorsType[] } }>('auth/login',
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatus({ status: 'loading' }));
    try {
      let res = await authAPI.login(data);
      if (res.resultCode === 0) {
        dispatch(setAppStatus({ status: 'succeeded' }));
        return;
      } else {
        handleServerAppError(res, dispatch);
        return rejectWithValue({ errors: res.messages, fieldsErrors: res.fieldsErrors });
      }
    } catch (err: any) {
      const error: AxiosError = err;
      handleServerNetworkError(err, dispatch);
      return rejectWithValue({ errors: [error.message] });
    }
  });

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
  dispatch(setAppStatus({ status: 'loading' }));
  try {
    let res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(setAppStatus({ status: 'succeeded' }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({});
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue({});
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    login: null as string | null,
  },
  reducers: {
    setUserData(state, action: PayloadAction<string>) {
      state.login = action.payload;
      state.isLoggedIn = true;
    }
  },
  extraReducers: builder => {
    // builder.addCase(login.fulfilled, (state) => {
    //     state.isLoggedIn = true
    // })
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoggedIn = false;
      state.login = null;
    });
    // builder.addCase(initApp.fulfilled, (state, action) => {
    //   if (action.payload) state.login = action.payload.login;
    //   state.isLoggedIn = true;
    // });
  }
});

export const { setUserData } = slice.actions;

export const authReducer = slice.reducer;