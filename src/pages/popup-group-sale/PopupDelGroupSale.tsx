import { Button, Modal } from 'antd';
import React from 'react';

const PopupDelGroupSale = (props: any) => {
	const { handleCancelModalDel, isModalOpenDel, handleOkDelGroupSale } = props;
	return (
		<div>
			<Modal
				forceRender
				visible={isModalOpenDel}
				destroyOnClose={true}
				onCancel={handleCancelModalDel}
				footer={null}
				title={<div>DELETE GROUP SALE</div>}
			>
				<p className="text-[#FF0000]">*Do you want to delete this group sale </p>
				<div className="flex justify-center">
					<Button onClick={() => handleOkDelGroupSale()} type="primary" danger className="mt-5">
						Delete
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default PopupDelGroupSale;
