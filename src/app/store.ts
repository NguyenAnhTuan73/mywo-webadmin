import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../reducer/appReducer';
import userReduce from '../reducer/userReducer';

export const store = configureStore({
	reducer: {
		user: userReduce,
		app: appReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
