import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from './global.store';

const rootReducer = combineReducers({
	global: globalReducer,
});

export default rootReducer;
