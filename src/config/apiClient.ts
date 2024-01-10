import { appAction } from './../reducer/appReducer';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
	getAccessToken,
	getRefreshToken,
	getToken,
	setAccessToken,
	deleteAccessToken,
	deleteRefreshToken,
	setRefreshToken,
} from '../helper/tokenHelper';
import { configApp } from './config';
import errCode from '../asset/err/err.json';
import store from '../store';
import messageConfig from './messageConfig';
import { userRefreshToken } from '../service/auth/AuthService';

message.config({
	duration: 1,
});
const keyHeaderCheckAuth = 'x-request-fail';
// const dispatch = useDispatch();
const nextToLogin = () => {
	const navigate = useNavigate();
	navigate('/authenticate');
};
const apiClient = axios.create({
	baseURL: `${configApp.hostApi}/${configApp.apiPrefix}/`,
	headers: {
		'content-type': 'application/json',
	},
});
apiClient.interceptors.request.use(function (config: any) {
	const accessToken = getAccessToken();
	if (accessToken) {
		config.headers.Authorization = 'JWT ' + accessToken;
		// config.headers[keyHeaderCheckAuth] = 0;
	}
	return config;
});
apiClient.interceptors.response.use(
	(res: any) => res,
	async (err: any) => {
		const refreshToken = getRefreshToken();
		const originalConfig = err?.config;
		// if url api  is 'login' then do not refresh
		if (originalConfig.url === 'authenticate' || !err.response) return Promise.reject(err);

		// avoid endless loop
		if (originalConfig.headers[keyHeaderCheckAuth] > 0) return Promise.reject(err);

		originalConfig.headers[keyHeaderCheckAuth] += 1;

		if (
			err?.response?.status === 401 &&
			err?.response?.data.message == 'Unauthorized request.' &&
			!originalConfig?._retry
		) {
			originalConfig._retry = true;
			await userRefreshToken();
			return apiClient(originalConfig);
		}
		if (err?.response?.status === 413) {
			message.error('Payload too large');
		}

		if (err?.response?.status === 403 && !err.config._retry) {
			const errMessage =
				(errCode ?? []).find((x: any) => x.code === err?.response?.data?.code)?.text ??
				messageConfig.ERROR_HAS_OCCURRED;
			store.dispatch(appAction.setErrCode(errMessage));
			nextToLogin();
		}
	},
);
export default apiClient;
