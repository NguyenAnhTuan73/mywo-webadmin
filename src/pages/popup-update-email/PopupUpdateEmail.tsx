import { Modal } from 'antd';
import React from 'react';

export const PopupUpdateEmail = (props: any) => {
	const { currentUser, isModalOpen, handleOk, handleCancel, dataToken } = props;
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
				onCancel={handleCancel}
				footer={null}
				className="p-2 rounded-sm"
				okButtonProps={{ style: { backgroundColor: '#13ae81', borderColor: '#13ae81' } }}
			>
				<div>
					{/* Form update email go there */}
				</div>
			</Modal>
		</div>
	);
};
