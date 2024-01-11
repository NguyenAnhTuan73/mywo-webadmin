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
			render: index => index + 1,
		},
		{
			title: 'ID',
			dataIndex: '_id',
			key: '_id',
			width: '150px',
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
			title: 'ROLE',
			dataIndex: 'role',
			key: 'role',
			render: record => {
				return record.role?.charAt(0).toUpperCase() + record.role?.slice(1);
			},
		},
		{
			title: 'TYPE',
			dataIndex: 'role',
			key: 'role',
			render: record => {
				return record.type?.charAt(0).toUpperCase() + record.type?.slice(1);
			},
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			width: '10%',
			render: record => {
				return record.status?.charAt(0).toUpperCase() + record.status?.slice(1);
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
				<Table className="min-w-full" columns={columnsModalDetail} dataSource={dataItem?.groupUsers} bordered />
			</Modal>
		</div>
	);
};
