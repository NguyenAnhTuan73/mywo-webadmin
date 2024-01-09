import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,  Form, Input, message, Spin } from 'antd';
import {  LockOutlined } from '@ant-design/icons';
import { errorAuth } from '../../enum/auth/auth.error';
import {  userUpdatePassword } from '../../service/auth/AuthService';
import {userInfoKey } from '../../helper/tokenHelper';
import { configApp } from '../../config/config';

export default function Authenticate() {
	const [formChange] = Form.useForm();
	const [isSpin, setIsSpin] = useState(false);
	const [oldPass, setOldPass] = useState('');
	const navigate = useNavigate();

	const onFinish = (values: any) => {
		const accessToken = localStorage.getItem(configApp.tokenKey);
		const sendParams = {
			password: values.password_old,
			password_new: values.password_new,
		};
		if (accessToken) {
			setIsSpin(true);
			userUpdatePassword(sendParams)
				.then(res => {
					message.success(res.data.message);
					setIsSpin(false);
					const LocalInfor = localStorage.getItem(userInfoKey);
					let newLocalInfor;
					if (LocalInfor) {
						newLocalInfor = JSON.parse(LocalInfor);
						newLocalInfor.password = sendParams.password_new;
					}
					localStorage.setItem(userInfoKey, JSON.stringify(newLocalInfor));
					navigate('/list-user');
				})
				.catch(err => {
					console.log(err);
					setIsSpin(false);
				});
		}
	};

	const localPassword = localStorage.getItem(userInfoKey);
	let checkPass: any;
	if (localPassword) {
		checkPass = JSON.parse(localPassword);
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const handleChangeInput = () => {
		const getPass = formChange.getFieldValue('password');
		setOldPass(getPass);
	};
	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<div className="w-full h-[100vh] bg_auth flex items-center">
					<div className="w-96  mx-auto rounded-md p-3">
						<Form
							name="basic"
							labelCol={{ span: 32 }}
							wrapperCol={{ span: 32 }}
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							size="large"
							form={formChange}
							className="items-center w-full h-full bg-white rounded my-auto"
						>
							<div className="p-5">
								<h1 className="mb-5 text-2xl font-sans text-center">CHANGE PASSWORD</h1>
								<Form.Item
									name="password_old"
									rules={[
										{
											validator(rule, val) {
												if (val === undefined || val === null || val === '') {
													return Promise.reject(new Error(errorAuth.PASSWORD_NONE));
												} else if (val !== checkPass.password) {
													return Promise.reject(
														new Error(errorAuth.PASSWORD_SAME_CONNECTED_NONE),
													);
												} else {
													return Promise.resolve();
												}
											},
										},
									]}
								>
									<Input
										prefix={<LockOutlined className="mr-2" />}
										placeholder="Please enter your old password"
										onChange={handleChangeInput}
									/>
								</Form.Item>
								<Form.Item
									name="password"
									rules={[
										{
											validator(rule, val) {
												if (val === undefined || val === null || val === '') {
													return Promise.reject(new Error(errorAuth.PASSWORD_NONE));
												} else if (val.length < 6) {
													return Promise.reject(new Error(errorAuth.PASSWORD_LENGTH));
												} else {
													return Promise.resolve();
												}
											},
										},
									]}
								>
									<Input.Password
										prefix={<LockOutlined className="mr-2" />}
										placeholder="Please enter your new password"
										onChange={handleChangeInput}
									/>
								</Form.Item>

								<Form.Item
									name="password_new"
									rules={[
										{
											validator(rule, val) {
												if (val !== oldPass) {
													return Promise.reject(new Error(errorAuth.PASSWORD_SAME_OLD_NONE));
												} else {
													return Promise.resolve();
												}
											},
										},
									]}
									className="mb-10"
								>
									<Input.Password
										prefix={<LockOutlined className="mr-2" />}
										placeholder="Please confirm your new password"
									/>
								</Form.Item>
								<p
									className="text-right cursor-pointer"
									onClick={() => {
										navigate('/reset-password');
									}}
								>
									Forgot Password?
								</p>
								<div className="flex justify-center">
									<p className="font-sans font-semibold">Don't have an account? </p>
									<p
										className="font-sans underline ml-1 cursor-pointer"
										onClick={() => {
											navigate('/register');
										}}
									>
										SIGN UP
									</p>
								</div>
								<Form.Item wrapperCol={{ offset: 32, span: 32 }} className="w-full">
									<Button type="primary" htmlType="submit" danger className="w-full rounded-md">
										Submit
									</Button>
								</Form.Item>
							</div>
						</Form>
					</div>
				</div>
			</Spin>
		</div>
	);
}
