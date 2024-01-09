import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Space, Table, Pagination, Input, Switch, Spin, Button, Modal } from 'antd';
import type { PaginationProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { getListGroups } from '../../service/user/UserService';
import { DataType } from '../../interface/list-user/list_user.interface';

import { TypeDataItem } from '../../interface/manage.interface';
import { getAccessToken } from '../../helper/tokenHelper';
import { group } from 'console';

export default function ListGroup() {
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalPopupDetail, setIsModalPopupDetail] = useState(false);
	const [currentGroups, setCurrentGroups] = useState<any>(null);
	const [dataItem, setDataItem] = useState<any>(null);
	const [statusActiveUser, setStatusActiveUser] = useState('');
	const [isSpin, setIsSpin] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
		// status: '',
	});
	const [objParams, setObjParams] = useState({
		search: '',
		page: 1,
		size: 10,
		// status: '',
	});
	const [blockDataGroups, setblockDataGroups] = useState<any>({ lengthUser: 0, dataGroups: [] });

	// loading
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		getDataListGroup(objParams);
	}, [getAccessToken()]);

	const getDataListGroup = async (objData = objParams) => {
		try {
			setSpinValues(true);
			setObjParams(objData);
			const res = await getListGroups(objData);

			setIsSpin(false);
			setblockDataGroups({
				lengthUser: res.data.groups[0]?.metadata[0].total,
				dataGroups: res.data.groups[0].data?.map((item: any, index: number) => {
					return {
						...item,
						index: index + 1 + (objData.page - 1) * numberLimit,
					};
				}),
			});
			setSpinValues(false);
			setIsSpin(false);
		} catch (error) {
			setIsSpin(false);
		}
	};

	const showModal = (item: any) => {
		setCurrentGroups(item?.groupUser);
		setDataItem(item);
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	// Popup change status
	const handleChangeStatus = (paramsUuid: string, activeStatus: string) => {
		setIsModalPopupDetail(true);
		setStatusActiveUser(activeStatus);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			width: 50,
			className: 'text-center',
			render: (text, object, index) => index + 1,
		},
		{
			title: 'NAME',
			dataIndex: 'name',
			width: 100,
			key: 'name',
		},

		{
			title: 'ID',
			dataIndex: '_id',
			width: 100,
			key: '_id',
		},
		{
			title: 'STATUS',
			dataIndex: 'status',
			width: 100,
			key: 'status',
			render: (email, record) => {
				return record.status?.charAt(0).toUpperCase() + record.status?.slice(1);
			},
		},

		{
			title: 'GROUP USERS',
			dataIndex: 'group_users',
			width: 100,
			key: 'group_users',
			render: (family, item) => (
				<Space size="middle">
					<Button
						type="primary"
						style={{ backgroundColor: '#2DC5DD', border: '#2DC5DD' }}
						onClick={() => {
							// handleClickMore(record['_id']);
							showModal(item);
						}}
					>
						View More
					</Button>
				</Space>
			),
			className: 'text-center',
		},
	];

	const columnsModalDetail: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			width: '5%',
			key: 'index',
			className: 'text-center',
			render: (text, object, index) => index + 1,
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
			render: (email, record) => {
				return record.role?.charAt(0).toUpperCase() + record.role?.slice(1);
			},
		},
		{
			title: 'TYPE',
			dataIndex: 'role',
			key: 'role',
			render: (email, record) => {
				return record.type?.charAt(0).toUpperCase() + record.type?.slice(1);
			},
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			width: '10%',
			render: (email, record) => {
				return record.status?.charAt(0).toUpperCase() + record.status?.slice(1);
			},
		},

		{
			title: 'EMAIL',
			dataIndex: 'email',
			key: 'email',
		},
	];

	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListGroup({
			...objParams,
			page: current,
			size: pageSize,
		});
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: current.toString(),
			size: pageSize.toString(),
		});
	};

	// click seach
	const handleClickSearch = (e: any) => {
		setIsSpin(true);
		setFilterSearch(e.target.value);
		getDataListGroup({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 1 });
	};
	const handleChange = (e: any) => {
		setFilterSearch(e.target.value);
		if (e.target.value === '') {
			handleClickSearch(e);
		}
		setFilterSearch(e.target.value);
	};
	const handleEnterSearch = (event: any) => {
		if (event.key === 'Enter') {
			handleClickSearch(event);
			return;
		}
	};

	return (
		<>
			<div className="">
				<h1 className="text-base font-bold"> USER GROUPS LIST</h1>
				<div className="flex items-center justify-between sm:flex-col">
					<div className="w-1/3 min-w-[220px]  xl:w-full my-3 sm:my-4 mr-3 xl:mr-0 flex items center">
						<Input
							placeholder="Find family by..."
							onChange={e => handleChange(e)}
							onKeyDown={handleEnterSearch}
						/>
						<Button type="primary" style={{ backgroundColor: '#2DC5DD', border: '#2DC5DD' }}>
							<div className="flex items-center" onClick={handleClickSearch}>
								<i className="bx bx-search text-base mr-1"></i>
								<span>Search</span>
							</div>
						</Button>
					</div>
					<div className="w-40 mr-3 md:w-30 sm:w-full sm:mb-2 sm:mr-0">
						<p className="mb-0 font-semibold">Total : {blockDataGroups.lengthUser} Groups</p>
					</div>
				</div>
				<div className="overflow-hidden">
					{isSpin ? (
						<div className="w-full h-full flex justify-center items-center">
							<Spin
								indicator={<LoadingOutlined style={{ fontSize: 32, color: '#2DC5DD' }} spin={isSpin} />}
							/>
						</div>
					) : (
						<Table
							bordered
							columns={columns}
							scroll={{ x: 700 }}
							dataSource={blockDataGroups.dataGroups}
							pagination={false}
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
				<div className="flex justify-end mt-3 ">
					<Pagination
						showSizeChanger
						defaultCurrent={1}
						total={blockDataGroups.lengthUser}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Families per page' }}
					/>
				</div>
			</div>
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
					<Table
						className="min-w-full"
						columns={columnsModalDetail}
						dataSource={dataItem?.groupUsers}
						bordered
					/>
				</Modal>
			</div>
		</>
	);
}
