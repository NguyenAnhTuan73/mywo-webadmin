import { Modal, Spin } from 'antd';

import Table, { ColumnsType } from 'antd/lib/table';

import { useEffect, useState } from 'react';
import { DataType } from '../../interface/list-user/list_user.interface';
import { LoadingOutlined } from '@ant-design/icons';

export const PopupUserGroupSale = (props: any) => {
	const { isOpenGroupSaleUser, handleCancelModalGroupSaleUser, dataItemUser } = props;
	const [spinValues, setSpinValues] = useState(false);
	const [isSpin, setIsSpin] = useState(true);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		if (dataItemUser) {
			setIsSpin(false);
		} else {
			setIsSpin(false);
		}
	}, [isOpenGroupSaleUser, dataItemUser]);

	const dataGroupSaleUSer = dataItemUser?.map((user: any) => {
		return {
			id: user?.userInfo[0]?._id,
			first_name: user?.userInfo[0]?.first_name,
			last_name: user?.userInfo[0]?.last_name,
			point_code: user?.userInfo[0]?.point_code,
			email: user?.userInfo[0]?.email,
			status: user?.userInfo[0]?.status,
			current_plan: user?.userInfo[0]?.current_plan,
		};
	});

	const columns: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			className: 'text-center',
			render: (text, object, index) => index + 1,
		},
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'FIRST NAME',
			dataIndex: 'first_name',
			key: 'first_name',
		},
		{
			title: 'LAST NAME',
			dataIndex: 'last_name',
			key: 'last_name',
		},
		{
			title: 'EMAIL',
			dataIndex: 'email',
			key: 'purchase_time',
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			className: 'text-center',
		},
		{
			title: 'POINT CODE',
			dataIndex: 'point_code',
			key: 'point_code',
		},

		{
			title: 'CURRENT PLAN',
			dataIndex: 'current_plan',
			key: 'current_plan',
		},
	];
	return (
		<div>
			<Modal
				forceRender
				visible={isOpenGroupSaleUser}
				destroyOnClose={true}
				onCancel={handleCancelModalGroupSaleUser}
				footer={null}
				title={<div>USER GROUP SALE </div>}
				width={'50%'}
			>
				<div className="overflow-hidden">
					{isSpin ? (
						<div className="w-full h-full flex justify-center items-center">
							<Spin size="large" spinning={isSpin} />
						</div>
					) : (
						<Table
							bordered
							columns={columns}
							scroll={{ x: 700 }}
							dataSource={dataGroupSaleUSer}
							locale={{
								emptyText: (
									<>
										{spinValues ? (
											<Spin indicator={antIcon} spinning={spinValues} />
										) : (
											<span className="italic font-medium  text-center">No data</span>
										)}
										,
									</>
								),
							}}
						/>
					)}
				</div>
			</Modal>
		</div>
	);
};
