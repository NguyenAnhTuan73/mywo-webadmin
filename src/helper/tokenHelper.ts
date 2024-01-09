import { configApp } from '../config/config';
// import { typeUserInfo } from '../interface/user/user.interface';

export const getToken = (key: string): string | null => localStorage.getItem(key);
export const setToken = (key: string, value: any) => localStorage.setItem(key, value);
export const getAccessToken = () => {
	return getToken(configApp.tokenKey);
};
export const getRefreshToken = () => {
	return getToken(configApp.refreshTokenKey);
};

export const setAccessToken = (accessToken: string) => {
	setToken(configApp.tokenKey, accessToken);
};
export const setRefreshToken = (refreshToken: string) => {
	setToken(configApp.refreshTokenKey, refreshToken);
};
export const deleteAccessToken = () => {
	localStorage.removeItem(configApp.tokenKey);
};
export const deleteRefreshToken = () => {
	localStorage.removeItem(configApp.refreshTokenKey);
};

// get user password for remember me
export const userInfoKey = 'useInfo';
export const getUserAndPassword = () => {
	try {
		const localInfo = localStorage.getItem(userInfoKey);
		const result = JSON.parse(localInfo!);
		return {
			userName: result.userName,
			password: result.password,
		};
	} catch (error) {
		return {
			userName: '',
			password: '',
		};
	}
};
export const setUserAndPasswordLocal = (userInfo: any) => {
	localStorage.setItem(userInfoKey, JSON.stringify(userInfo));
};
export const deleteUserAndPasswordLocal = () => {
	localStorage.removeItem(userInfoKey);
};

const keyRememberMe = 'rememberMe';
export const setRememberMe = (value: string) => {
	localStorage.setItem(keyRememberMe, value);
};
export const getRememberMe = (): string | null => localStorage.getItem(keyRememberMe);
export const deleteRememberMe = () => {
	localStorage.removeItem(keyRememberMe);
};
