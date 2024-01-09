import React, { useState } from 'react';
import {  Modal,  Spin } from 'antd';

import './PopupAdd.scss';

export default function PopupAdd(props: any) {
	const { ModalVisibleAdd, handleCancelAdd, handleOKAdd, statusActiveUser } = props;
	const [isSpin, setIsSpin] = useState(false);

	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<Modal
					destroyOnClose={true}
					visible={ModalVisibleAdd}
					onCancel={handleCancelAdd}
					onOk={handleOKAdd}
					className="round-sm text-center"
					centered
				>
					{statusActiveUser === 'active' ? (
					<p className="text-center text-red-600 text-[1.2rem]">Do you want to deactivate this account?</p>
					) : statusActiveUser === 'inactive' ? (
					<p className="text-center text-red-600 text-[1.2rem]">Do you want to activate this account?</p>
					) : statusActiveUser ? (
					<p className="text-center text-red-600 text-[1.2rem]">Do you want to verified this account email?</p>
					) : <p className="text-center text-red-600 text-[1.2rem]">Can not unverified!</p> }
				</Modal>
			</Spin>
		</div>
	);
}
