import React, { useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import {
	LockOutlined,
	UserOutlined,
	EyeTwoTone,
	EyeInvisibleOutlined,
} from '@ant-design/icons';
import { errorAuth } from '../../enum/auth/auth.error';
import { userLoginAdmin } from '../../service/auth/AuthService';
import { useDispatch, } from 'react-redux';
import { userAction } from '../../reducer/userReducer';
import { useNavigate } from 'react-router-dom';
import { setAccessToken, setRefreshToken, setUserAndPasswordLocal } from '../../helper/tokenHelper';
import { formatEmail } from '../../constant/data/data.constant';
import { AuthInterface } from '../../interface/auth/auth.interface';
import { images } from '../../constant';

import './Authenticate.scss';

export default function Authenticate() {
	const dispatch = useDispatch();
	const [isSpin, setIsSpin] = useState(false);
	const navigate = useNavigate();

	const onFinish = (values: AuthInterface) => {
		setIsSpin(true);
		userLoginAdmin(values)
			.then(res => {
				dispatch(userAction.setUserLogin(res.data.result));
				message.success(res.data.message);
				setUserAndPasswordLocal(res.data.result.user);
				setAccessToken(res.data.result.token);
				setRefreshToken(res.data.result.refreshToken);
				setIsSpin(false);
				navigate('/dashboard');
			})
			.catch(err => {
				message.error('login faild');
				setIsSpin(false);
			});
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Spin size="small" spinning={isSpin} delay={1000}>
			<div className="w-full h-[100vh] bg_auth flex items-center">
				<div className="w-[30rem] min-w-[300px] mx-auto rounded-[10px] p-3">
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
						className="items-center w-full h-full bg-white rounded my-auto shadow-md"
					>
						<div className="px-5 py-10">
							<div className="w-full mb-5 ">
								<img className=" mx-auto block" src={images.logo} alt="" />
							</div>
							<Form.Item
								name="email"
								rules={[
									{
										validator(rule, val) {
											if (val === undefined || val === null || val === '') {
												return Promise.reject(new Error(errorAuth.EMAIL_NONE));
											} else if (!formatEmail.test(val)) {
												return Promise.reject(new Error(errorAuth.EMAIL_FORMAT));
											} else {
												return Promise.resolve();
											}
										},
									},
								]}
							>
								<Input
									prefix={<UserOutlined className="mr-2" />}
									placeholder="Please enter your email"
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
								className="mb-10"
							>
								<Input.Password
									prefix={<LockOutlined className="mr-2" />}
									placeholder="Please enter your password"
									iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeTwoTone />)}
								/>
							</Form.Item>
							{/* <p
								className="text-right cursor-pointer"
								onClick={() => {
									navigate('/reset-password');
								}}
							>
								Forgot Password?
							</p> */}
							{/* <div className="flex justify-center">
								<p className="font-sans font-semibold">Don't have an account? </p>
								<p
									className="font-sans underline ml-1 cursor-pointer"
									onClick={() => {
										navigate('/register');
									}}
								>
									SIGN UP
								</p>
							</div> */}
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
	);
}
