import { Modal } from 'antd';
import React from 'react';

export const PopupGetToken = (props: any) => {
	const { currentUser, isModalOpen, handleOk, handleCancel, dataToken } = props;
	return (
		<div>
			<Modal
				title={
					<div>
						Users token information :{' '}
						<span className="text-red-600">
							{currentUser?.first_name} {currentUser?.last_name}
						</span>
					</div>
				}
				destroyOnClose={true}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={null}
				className="p-2 rounded-sm"
				okButtonProps={{ style: { backgroundColor: '#13ae81', borderColor: '#13ae81' } }}
			>
				<div>
					<p>
						{' '}
						<b>Email:</b> {currentUser?.email}
					</p>
					<p>
						{' '}
						<b>Token:</b> {dataToken?.token}
					</p>
					<p>
						{' '}
						<b>Refresh token:</b> {dataToken?.refreshToken}
					</p>
				</div>
			</Modal>
		</div>
	);
};
