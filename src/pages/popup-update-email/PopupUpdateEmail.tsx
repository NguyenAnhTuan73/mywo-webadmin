import { Button, Form, Input, message, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { changeEmailOfUser } from '../../service/auth/AuthService';

export const PopupUpdateEmail = (props: any) => {
	const { currentUser, isModalOpen, handleOk, handleCancel, dataToken, setStatusChangeEmail } = props;

	const [valueEmail, setValueEmail] = useState(currentUser?.email || '');
	const [errorMessage, setErrorMessage] = useState('');
	useEffect(() => {
		setValueEmail(currentUser?.email);
	}, [currentUser, isModalOpen]);

	const validateEmail = (email: string) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};
	const handleOnChange = (e: any) => {
		const { value } = e.target;
		setValueEmail(value);
	};
	const handleCancelModal = () => {
		handleCancel();
		setErrorMessage('');
	};

	const handleChangeEmail = async () => {
		try {
			if (validateEmail(valueEmail)) {
				const res = await changeEmailOfUser({ email: valueEmail, code: currentUser.point_code });
				console.log("🚀 ~ handleChangeEmail ~ res:", res)

				if (!res.data) {
					message.error(res.data.message);
				} else {
					setStatusChangeEmail(true);
					message.success(res.data.message);
					handleCancelModal();
				}
			} else {
				setErrorMessage('Invalid email format');
			}
		} catch (error) { }
	};

	return (
		<div>
			<Modal
				title={
					<div>
						Change Email :{' '}
						<span className="text-red-600">
							{currentUser?.first_name} {currentUser?.last_name}
						</span>
					</div>
				}
				destroyOnClose={true}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancelModal}
				footer={null}
				className="p-2 rounded-sm"
				okButtonProps={{ style: { backgroundColor: '#13ae81', borderColor: '#13ae81' } }}
			>
				<div className="flex items-start w-full">
					<h1 className="mb-0 mr-2">Email:</h1>
					<div className="w-full flex-1">
						<Form>
							<Form.Item validateStatus={errorMessage ? 'error' : ''} help={errorMessage}>
								<Input
									className="w-full"
									value={valueEmail}
									onChange={handleOnChange}
									type="email"
									placeholder="Enter your email"
								/>
							</Form.Item>
						</Form>
					</div>
				</div>
				<div className="flex justify-center mt-10">
					<Button
						style={{ backgroundColor: '#13ae81', border: '#13ae81', borderRadius: '8px' }}
						type="primary"
						size="middle"
						onClick={() => handleChangeEmail()}
					>
						Change
					</Button>
				</div>
			</Modal>
		</div>
	);
};
