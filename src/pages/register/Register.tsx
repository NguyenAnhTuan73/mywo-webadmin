import React, { useState } from 'react';
import { Button,  Form, Input, message, Spin } from 'antd';
import { FolderOutlined, LockOutlined, PhoneOutlined, SnippetsOutlined } from '@ant-design/icons';
import { errorAuth } from '../../enum/auth/auth.error';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../../service/auth/AuthService';
import { formatEmail } from '../../constant/data/data.constant';

import './Register.scss';

export default function Register() {
	const [formRegister] = Form.useForm();
	const [usePassWord, setUsePassword] = useState<string>('');
	const dispatch = useDispatch();
	const [isSpin, setIsSpin] = useState(false);
	const navigate = useNavigate();

	const onFinish = (values: any) => {
		setIsSpin(true);
		userRegister(values)
			.then(res => {				
				message.success(res.data.message);
				setIsSpin(false);
				formRegister.setFieldsValue({
					name: '',
					phone: '',
					email: '',
					password: '',
					password_confirmation: '',
				});
			})
			.catch(err => {
				setIsSpin(false);
				message.error('register faild');
			});
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const handleChange = () => {
		const realPass = formRegister.getFieldValue('password');
		setUsePassword(realPass);
	};
	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<div className="w-full h-[100vh] bg_auth flex items-center">
					<div className="w-96 mx-auto rounded-md p-3">
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
							className="items-center w-full h-full bg-white rounded my-auto"
							form={formRegister}
						>
							<div className="p-5">
								<h1 className="mb-5 text-2xl font-sans text-center">SIGN UP</h1>
								<Form.Item
									name="name"
									rules={[
										{
											validator(rule, val) {
												if (val === undefined || val === null || val === '') {
													return Promise.reject(new Error(errorAuth.NAME_NONE));
												} else {
													return Promise.resolve();
												}
											},
										},
									]}
								>
									<Input
										prefix={<SnippetsOutlined className="mr-2" />}
										placeholder="Please enter your name"
									/>
								</Form.Item>
								<Form.Item
									name="phone"
									rules={[
										{
											validator(rule, val) {
												if (val === undefined || val === null || val === '') {
													return Promise.reject(new Error(errorAuth.PHONE_NONE));
												} else {
													return Promise.resolve();
												}
											},
										},
										{
											pattern: new RegExp(/^[0-9\b]+$/),
											message: errorAuth.PHONE_NUMBER,
										},
									]}
								>
									<Input
										prefix={<PhoneOutlined className="mr-2" />}
										placeholder="Please enter your phone"
										// type="number"
									/>
								</Form.Item>
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
										prefix={<FolderOutlined className="mr-2" />}
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
								>
									<Input.Password
										prefix={<LockOutlined className="mr-2" />}
										placeholder="Please enter your password"
										onChange={handleChange}
									/>
								</Form.Item>

								<Form.Item
									name="password_confirmation"
									rules={[
										{
											validator(rule, val) {
												if (val === undefined || val === null || val === '') {
													return Promise.reject(new Error(errorAuth.PASSWORD_CONFIRM_NONE));
												} else if (usePassWord !== val) {
													return Promise.reject(new Error(errorAuth.PASSWORD_INCORRECT));
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
										placeholder="Please confirm your password"
									/>
								</Form.Item>

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
