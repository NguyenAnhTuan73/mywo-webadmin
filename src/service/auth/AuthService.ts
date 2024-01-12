import qs from 'qs';
import apiClient from '../../config/apiClient';
import { setAccessToken, setRefreshToken, getRefreshToken, getAccessToken } from '../../helper/tokenHelper';
import { AuthInterface, TypeDataAddPointUser, ManualPage } from '../../interface/auth/auth.interface';
import { TypeChangePassword } from '../../interface/change-password/change.interface';
import { TypeObjParams } from '../../interface/list-user/list_user.interface';

export const userLoginAdmin = async (params: AuthInterface) => {
	return await apiClient.post('/admin/login', params);
};

export const userLogout = async (params: any) => {
	return await apiClient.post('/logout', params);
};

export const userUpdatePassword = async (params: TypeChangePassword) => {
	return await apiClient.post('/update-password', params);
};

export const userRegister = async (params: any) => {
	return await apiClient.post('/register', params);
};
export const getAllManualPage = async () => {
	return await apiClient.get('/admin/getAllManualPage');
};
export const saveManualPage = async (params: any) => {
	return await apiClient.post('/admin/saveManualPage', params);
};

export const userRefreshToken = async () => {
	try {
		const refreshToken = getRefreshToken();
		const res = await apiClient.post('/admin/refresh-token', { refreshToken });
		const accessToken = res.data.token;
		if (accessToken !== getAccessToken()) {
			setAccessToken(accessToken);
			// window.location.reload();
		}
	} catch (error) {
		setAccessToken('');
		setRefreshToken('');
		// window.location.reload();
	}
};

export const userResetPassword = async (params: any) => {
	return await apiClient.post('/send-email-forgot-pass', params);
};

export const userLoginByEmail = async (params: any) => {
	return await apiClient.post('/users/login-by-email', params);
};
export const adminAddPoint = async (params: any) => {
	return await apiClient.post('/admin/adminAddPoint', params);
};
export const adminAddAppStoreName = async (params: any) => {
	return await apiClient.post('/admin/adminAddAppstoreName', params);
};
export const adminGetAddPointFromAppStoreRate = async (params: TypeObjParams) => {
	let objParamUrls = qs.stringify(params);
	return await apiClient.get(`/admin/adminGetAddPointFromAppStoreRate?${objParamUrls}`);
};

// Send email to user
export const getMailTemplate = async () => {
	return await apiClient.get('/admin/getMailTemplate');
};
export const saveMailTemplate = async (params: any) => {
	return await apiClient.post('/admin/saveMailTemplate', params);
};
export const saveMailToUser = async (params: any) => {
	return await apiClient.post('/admin/sendMailToUser', params);
};

// Post
export const getPosts = async () => {
	return await apiClient.get('/post/getPosts');
};

export const addPost = async (params: any) => {
	return await apiClient.post('/post/addPost', params);
};
