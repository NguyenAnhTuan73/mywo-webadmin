import apiClient from '../../config/apiClient';
import { deleteAccessToken, setAccessToken, setToken } from '../../helper/tokenHelper';
import { configApp } from '../../config/config';
import { TypeBodyChangeStatus, TypeObjParams } from '../../interface/list-user/list_user.interface';
var qs = require('querystringify');

export const getDashboard = async () => {
	return await apiClient.get(`/admin/dashboard`);
};

export const getVnpStatus = async () => {
	return await apiClient.get(`/get-status-vnpay`);
};

export const updateVnpStatus = async (objParamsId: any) => {
	console.log(objParamsId);
	return await apiClient.post(`/update-vnpay`, objParamsId);
};

export const getListUser = async (params: TypeObjParams) => {
	// console.log(params);
	let objParamUrls = qs.stringify(params);
	return await apiClient.get(`/admin/getUsers?${objParamUrls}`);
};
export const getListUserSendEmail = async (params: TypeObjParams, data: any) => {
	// console.log(params);
	let objParamUrls = qs.stringify(params);
	return await apiClient.post(`/admin/users?${objParamUrls}`, data);
};

export const getSelectToFilter = async (params: string[]) => {
	const myArrayQry = params
		.map(function (el: string, idx: number) {
			return 'fields[' + idx + ']=' + el;
		})
		.join('&');
	return await apiClient.get(`/admin/getDistinctFieldDevices?${myArrayQry}`);
};

export const getListGroups = async (params: TypeObjParams) => {
	let objParamUrls = qs.stringify(params);
	return await apiClient.get(`/admin/getGroups?${objParamUrls}`);
};

export const getListDevice = async (params: TypeObjParams) => {
	let objParamUrls = qs.stringify(params);
	return await apiClient.get(`/admin/getDevices?${objParamUrls}`);
};

export const activeUser = async (body: TypeBodyChangeStatus) => {
	return await apiClient.post(`/admin/active-user`, body);
};

export const verifiedEmailUser = async (objParamsId: any) => {
	return await apiClient.post(`/admin/verifiedEmailUser`, objParamsId);
};

export const sendToUser = async (objParamsUser: any) => {
	return await apiClient.post(`/admin/sendPushToUser`, objParamsUser);
};

// LIST GROUP SALE
export const addGroupSale = async (objParams: any) => {
	return await apiClient.post(`/admin/add-group-sale`, objParams);
};

export const getListGroupSale = async () => {
	return await apiClient.get(`/admin/get-list-group-sale`);
};

export const getGroupSale = async () => {
	return await apiClient.get(`/admin/get-group-sale`);
};
export const delGroupSaleById = async (data: any) => {
	return await apiClient.delete(`/admin/deleteGroupSaleById`, { data });
};

// get error

export const getError = async () => {
	return await apiClient.get(`/admin/get-line-errors`);
};
