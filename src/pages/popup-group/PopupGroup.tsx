import { Modal } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { DataType } from '../../interface/list-user/list_user.interface';

export const PopupGroup = (props: any) => {
	const { dataItem, isModalOpen, handleOk, handleCancel } = props;
	const columnsModalDetail: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			width: '5%',
			key: 'index',
			className: 'text-center',
			render: (a, b, index) => index + 1,
		},
		{
			title: 'ID',
			dataIndex: '_id',
			key: '_id',
			width: '150px',
		},
		{
			title: 'ROLE',
			dataIndex: 'role',
			key: 'role',
			width: '8%',
			className: 'text-center',
			render: role => {
				return role?.charAt(0).toUpperCase() + role?.slice(1);
			},
		},
		{
			title: 'FIRST NAME',
			dataIndex: 'fname',
			key: 'fname',
		},
		{
			title: 'LAST NAME',
			dataIndex: 'lname',
			key: 'lname',
		},
		{
			title: 'TYPE',
			dataIndex: 'type',
			key: 'type',
			render: type => {
				return type?.charAt(0).toUpperCase() + type?.slice(1);
			},
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			width: '8%',
			className: 'text-center',
			render: status => {
				return status?.charAt(0).toUpperCase() + status?.slice(1);
			},
		},
		{
			title: 'EMAIL',
			dataIndex: 'email',
			key: 'email',
		},
	];
	return (
		<div className="min-w-[1050px]">
			<Modal
				title={
					<div>
						GROUP NAME: <span className="text-red-600">{dataItem?.name}</span>{' '}
					</div>
				}
				visible={isModalOpen}
				destroyOnClose={true}
				onOk={handleOk}
				onCancel={handleCancel}
				className="p-2 pb-4 rounded-sm min-w-[67rem]"
				footer={null}
				width={'90%'}
			>
				<div className="mb-4 flex justify-end font-semibold">
					Total: {dataItem?.groupUsers?.length | 0} Group users
				</div>
				<Table className="min-w-full" columns={columnsModalDetail} dataSource={dataItem?.groupUsers} bordered />
			</Modal>
		</div>
	);
};
