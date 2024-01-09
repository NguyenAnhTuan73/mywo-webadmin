import React, { useState } from 'react';
import { Button, Form, Input, message, Spin } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { errorAuth } from '../../enum/auth/auth.error';
import { userResetPassword } from '../../service/auth/AuthService';
import { formatEmail } from '../../constant/data/data.constant';
import { TypeDataForgotPass } from '../../interface/reset/reset.interface';

export default function ResetPass() {
	const [isSpin, setIsSpin] = useState(false);

	const onFinish = (values: TypeDataForgotPass) => {
		setIsSpin(true);
		userResetPassword(values)
			.then((res: any) => {
				setIsSpin(false);
				message.success(res.data.message);
			})
			.catch((err: any) => {
				setIsSpin(false);
			});
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
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
							className="items-center w-full h-full bg-white rounded my-auto"
						>
							<div className="p-5">
								<h1 className="mb-5 text-2xl font-sans text-center">FORGOT PASSWORD</h1>
								<p>Enter your email below to receive your password reset instructions</p>
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
