import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin,  } from 'antd';
import { sendToUser } from '../../service/user/UserService';
import TextArea from 'antd/lib/input/TextArea';
import './PopupSend.scss';

export default function PopupSend(props: any) {
	const [formSendUSer] = Form.useForm();
	const { isModalVisibleSend, handleCancelSend, handleOKSend, arrayIdUser } = props;
	const [isSpin, setIsSpin] = useState(false);

	const onFinish = (values: any) => {
		const stringSendToUser = arrayIdUser.join(',');
		const objParamsSend = { ...values, user_string: stringSendToUser };
		if (objParamsSend.user_string === '') {
			message.error('You need to select the user to send information!');
		} else {
			sendToUser(objParamsSend)
				.then(res => {
					
					message.success(res.data.message);
					formSendUSer.setFieldsValue({
						message: '',
						title: '',
					});
				})
				.catch(err => {
					message.error(err.data.message);
				});
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<Modal
					visible={isModalVisibleSend}
					destroyOnClose={true}
					onCancel={handleCancelSend}
					onOk={() => {
						handleOKSend();
					}}
					title="BOX SEND TO USERS"
					className="round-sm text-center flex items-center"
					centered
					footer={null}
				>
					<Form
						name="basic"
						labelCol={{ span: 32 }}
						wrapperCol={{ span: 32 }}
						initialValues={{ remember: true }}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						layout="vertical"
						form={formSendUSer}
					>
						<Form.Item
							label="Title Send To User"
							name="title"
							rules={[{ required: true, message: 'Please input your title!' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Message Send To User"
							name="message"
							rules={[{ required: true, message: 'Please input your message!' }]}
						>
							<TextArea rows={4} />
						</Form.Item>

						<Form.Item wrapperCol={{ offset: 32, span: 32 }}>
							<div className="w-[100px] mx-auto">
								<Button className="w-full" type="primary" htmlType="submit">
									Send
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Modal>
			</Spin>
		</div>
	);
}
