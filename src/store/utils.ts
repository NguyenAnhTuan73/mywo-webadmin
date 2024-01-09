import { Dispatch } from '@reduxjs/toolkit';
import { AppStore } from './';
import { merge } from 'lodash';
import moment from 'moment';

type ThunkAction<T = any> = (dispatch: Dispatch, state: AppStore['getState']) => Promise<T>;

export const createAsyncAction = <T = any, R = any>(cb: (arg: T) => ThunkAction<R>) => {
	return cb;
};
