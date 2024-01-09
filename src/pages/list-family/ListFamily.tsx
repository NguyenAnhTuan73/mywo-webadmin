import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Space, Table, Pagination, Input, Switch, Spin, Button, Modal } from 'antd';
import type { PaginationProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { getListFamily } from '../../service/user/UserService';
import { DataType } from '../../interface/list-user/list_user.interface';
import PopupAdd from '../popup-add/PopupAdd';
import { TypeDataItem } from '../../interface/manage.interface';
import { getAccessToken } from '../../helper/tokenHelper';

export default function ListFamily() {
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalPopupDetail, setIsModalPopupDetail] = useState(false);
	const [currentFamilies, setCurrentFamilies] = useState<any>(null);
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
	const [blockDataFamily, setBlockDataFamily] = useState<any>({ lengthUser: 0, dataUser: [] });

	// loading
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		getDataListFamily(objParams);
	}, [getAccessToken()]);

	const getDataListFamily = async (objData = objParams) => {
		try {
			setSpinValues(true);
			setObjParams(objData);
			const res = await getListFamily(objData);
			setIsSpin(false);
			setBlockDataFamily({
				lengthUser: res.data.families.total,
				family: res.data.families.docs?.map((item: any, index: number) => {
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
		setCurrentFamilies(item.userfamilies);
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
	const handleCancelStatus = () => {
		setIsModalPopupDetail(false);
	};
	const handleOkStatus = () => {
		setIsModalPopupDetail(false);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			width: 50,
			className: 'text-center',
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
			title: 'MEMBERS',
			dataIndex: 'members',
			width: 100,
			key: 'members',
			render: (family, item) => (
				<Space size="middle">
					<Button
						type="primary"
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
		{
			title: 'PASS CODE',
			width: 100,
			key: 'pass_code',
			dataIndex: 'pass_code',
			className: 'text-center',
		},
	];

	const columnsModalDetail: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			width: '50px',
			key: 'index',
			className: 'text-center',
		},
		{
			title: 'FIRST NAME',
			dataIndex: 'first_name',
			key: 'first_name',
			width: '100px',
		},
		{
			title: 'LAST NAME',
			dataIndex: 'last_name',
			key: 'last_name',
			width: '100px',
		},
		{
			title: 'EMAIL',
			dataIndex: 'email',
			key: 'email',
			width: '200px',
		},
		{
			title: 'ID',
			dataIndex: '_id',
			key: '_id',
			width: '150px',
		},
		{
			title: 'USER',
			dataIndex: 'user',
			key: 'user',
			width: '150px',
		},

		{
			title: 'STATUS',
			dataIndex: 'Status',
			key: 'status',
			width: '150px',
			render: (_, record) => (
				<Space size="middle">
					<Switch
						checked={record.status === 'active'}
						onChange={() => {
							handleChangeStatus(record['_id'], record.status);
						}}
					/>
				</Space>
			),
			className: 'text-center',
		},

		{
			title: 'ROLE',
			dataIndex: 'role',
			key: 'role',
			width: '100px',
			className: 'text-center',
		},
	];
	const dataShowItemFamily = currentFamilies?.map((items: TypeDataItem, index: number) => {
		return {
			_id: items['_id'],
			user: items.user,
			status: items.status,
			role: items.role,
			email: items.userInfo[0].email,
			first_name: items.userInfo[0].first_name,
			last_name: items.userInfo[0].last_name,
			index: index + 1,
		};
	});
	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListFamily({
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
		getDataListFamily({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 1 });
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
				<h1 className="text-base font-bold"> USER FAMILIES LIST</h1>
				<div className="flex items-center justify-between sm:flex-col">
					<div className="w-1/3 min-w-[220px]  xl:w-full my-3 sm:my-4 mr-3 xl:mr-0 flex items center">
						<Input
							placeholder="Find family by..."
							onChange={e => handleChange(e)}
							onKeyDown={handleEnterSearch}
						/>
						<Button type="primary">
							<div className="flex items-center" onClick={handleClickSearch}>
								<i className="bx bx-search text-base mr-1"></i>
								<span>Search</span>
							</div>
						</Button>
					</div>
					<div className="w-40 mr-3 md:w-30 sm:w-full sm:mb-2 sm:mr-0">
						<p className="mb-0 font-semibold">Total : {blockDataFamily.lengthUser} families</p>
					</div>
				</div>
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
							dataSource={blockDataFamily.family}
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
						total={blockDataFamily.lengthUser}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Families per page' }}
					/>
				</div>
			</div>
			<div className="min-w-[1050px]">
				<Modal
					title={
						<div>
							LIST DETAILS MEMBER USER: <span className="text-red-600">{dataItem?.name}</span>{' '}
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
						dataSource={dataShowItemFamily}
						pagination={false}
					/>
				</Modal>
			</div>
			<PopupAdd
				ModalVisibleAdd={isModalPopupDetail}
				handleCancelAdd={handleCancelStatus}
				handleOKAdd={handleOkStatus}
				statusActiveUser={statusActiveUser}
			/>
		</>
	);
}
