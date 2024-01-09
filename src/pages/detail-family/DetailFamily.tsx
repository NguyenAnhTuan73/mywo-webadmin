import React, { useEffect, useState } from 'react';
import { Space, Table, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getListFamily } from '../../service/user/UserService';
import { DataType } from '../../interface/list-user/list_user.interface';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';

export default function DetailFamily() {
	const [searchParams, setSearchParams] = useSearchParams({});
	const [objParams, setObjParams] = useState({
		search: '',
		page: 1,
		size: 10,
	});

	const [blockDataFamily, setBlockDataFamily] = useState<any>({ lengthUser: 0, dataUser: [] });

	useEffect(() => {
		getListFamily(objParams)
			.then((res: any) => {
				setBlockDataFamily({
					lengthUser: res.data.families.total,
					dataUser: res.data.families.docs,
				});
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, [objParams]);

	const idDetailFamily = searchParams.get('id');

	const itemFamilyDetail = blockDataFamily.dataUser.find((item: any, index: number) => {
		if (item['_id'] === idDetailFamily) {
			return item;
		}
	});

	const dataShowItemFamily = itemFamilyDetail?.userfamilies.map((item: any, index: number) => {
		return {
			_id: item['_id'],
			user: item.user,
			status: item.status,
			role: item.role,
			email: item.userInfo[0].email,
			first_name: item.userInfo[0].first_name,
			last_name: item.userInfo[0].last_name,
			index: index + 1,
		};
	});

	const columns: ColumnsType<DataType> = [
		{
			title: '',
			dataIndex: 'index',
			key: 'index',
		},
		{
			title: 'First Name',
			dataIndex: 'first_name',
			key: 'first_name',
		},
		{
			title: 'Last Name',
			dataIndex: 'last_name',
			key: 'last_name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'ID',
			dataIndex: '_id',
			key: '_id',
		},
		{
			title: 'user',
			dataIndex: 'user',
			key: 'user',
		},

		{
			title: 'Status',
			dataIndex: 'Status',
			key: 'status',
			render: (_, record) => (
				<Space size="middle">
					<Switch checked={record.status === 'active'} />
				</Space>
			),
		},

		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
		},
	];

	return (
		<>
			{/* <div className="md:overflow-y-auto"> */}
			<div className="mt-10">
				<h1>LIST DETAILS MEMBER USER</h1>
				<Table columns={columns} dataSource={dataShowItemFamily} pagination={false} scroll={{ x: 1500 }} />
			</div>
			{/* </div> */}
		</>
	);
}
