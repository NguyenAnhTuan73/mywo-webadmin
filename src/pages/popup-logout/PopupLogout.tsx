import React, { useState } from 'react';
import {  Modal, Spin } from 'antd';
import './PopupLogout.scss';

export default function PopupLogout(props: any) {
	const { ModalVisible, handleCancel, handleOK } = props;
	const [isSpin, setIsSpin] = useState(false);

	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<Modal
					destroyOnClose={true}
					visible={ModalVisible}
					onCancel={handleCancel}
					onOk={handleOK}
					className="round-sm text-center"
					centered
				>
					<p className="text-center text-red-600">Do you want to logout your account?</p>
				</Modal>
			</Spin>
		</div>
	);
}
