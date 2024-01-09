import React, { useState } from 'react';
import { Modal, Pagination, PaginationProps, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DataType } from '../../interface/list-user/list_user.interface';

const PopupGroupUsers = (props: any) => {
	const { currentUser, isModalOpen, handleOk, handleCancel } = props;
	console.log('🚀 ~ PopupGroupUsers ~ currentUser:', currentUser);

	const columns: ColumnsType<DataType> = [
		{
			title: 'NO.',
			dataIndex: 'index',
			key: 'index',
			width: '5%',
			className: 'text-center',
			render: (text, object, index) => index + 1,
		},
		{
			title: 'CODE',
			dataIndex: 'point_code',
			key: 'point_code',
			width: '5%',
		},
		{
			title: 'ROLE',
			dataIndex: 'role',
			key: 'role',
			width: '10%',
			render: (email, item) => {
				return item?.role?.charAt(0).toUpperCase() + item?.role?.slice(1);
			},
		},
		{
			title: 'TYPE',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			render: (email, item) => {
				return item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1);
			},
		},

		{
			title: 'FIRST NAME',
			dataIndex: 'fname',
			key: 'last_name',
			width: '12%',
		},
		{
			title: 'LAST NAME',
			dataIndex: 'lname',
			key: 'last_name',
			width: '12%',
		},

		{
			title: 'EMAIL',
			key: 'email',
			dataIndex: 'email',
			width: '20%',
			render: (email, record) => {
				return record.email ? record.email : record.tmp_email;
			},
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			width: '20%',
			render: (email, record) => {
				return record.status?.charAt(0).toUpperCase() + record.status?.slice(1);
			},
		},
	];

	return (
		<div>
			<Modal
				title={
					<div>
						User name:{' '}
						<span className="text-red-600">
							{currentUser?.first_name} {currentUser?.last_name}
						</span>
					</div>
				}
				destroyOnClose={true}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				className="p-2 rounded-sm"
				width="85%"
				okButtonProps={{ style: { backgroundColor: '#29C2DB', borderColor: '#29C2DB' } }}
			>
				<div className="mb-4">Total: {currentUser?.groupUsers?.length | 0} Users</div>
				<Table
					bordered
					columns={columns}
					scroll={{ x: 'max-content' }}
					dataSource={currentUser?.groupUsers}

					// onChange={onChangePlan}
					// locale={{
					//  emptyText: (
					//      <>
					//          {spinValues ? (
					//              <Spin indicator={antIcon} spinning={spinValues} />
					//          ) : (
					//              <span className="italic font-medium  text-center">No data</span>
					//          )}
					//          ,
					//      </>
					//  ),
					// }}
				/>
				{/* <div className="flex justify-end mt-3 ">
					<Pagination
						// current={Number(pageValue)}
						showSizeChanger
						defaultCurrent={1}
						// defaultPageSize={objParams.size}
						total={currentUser?.groupUsers?.length | 0}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Users per page' }}
					/>
				</div> */}
			</Modal>
		</div>
	);
};

export default PopupGroupUsers;
