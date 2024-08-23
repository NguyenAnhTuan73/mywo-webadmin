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

import { getAccessToken } from '../../helper/tokenHelper';

import { PopupGroup } from '../popup-group/PopupGroup';

export default function ListGroup() {
	const [filterSearch, setFilterSearch] = useState<string>('');

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [currentGroups, setCurrentGroups] = useState<any>(null);
	const [dataItem, setDataItem] = useState<any>(null);

	const [isSpin, setIsSpin] = useState(true);
	const params = new URLSearchParams(location.search);
	const searchValue = params.get('search');
	const pageValue = params.get('page') == null ? 1 : Number(params.get('page'));
	const sizeValue = params.get('size') == null ? 10 : Number(params.get('size'));
	const [objParams, setObjParams] = useState({
		search: searchValue,
		page: pageValue,
		size: sizeValue,
		// status: '',
	});
	const [numberPage, setNumberPage] = useState(pageValue);
	const [numberLimit, setNumberLimit] = useState(sizeValue);
	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '1',
		size: '10',
		// status: '',
	});
	const [blockDataGroups, setblockDataGroups] = useState<any>({ lengthUser: 0, dataGroups: [] });

	// loading
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		getDataListGroup(objParams);
	}, [getAccessToken()]);

	const getDataListGroup = async (objData: any) => {
		setSpinValues(true);
		try {
			setObjParams(objData);
			const res = await getListGroups(objData);

			setIsSpin(false);
			setblockDataGroups({
				lengthUser: res.data.groups[0]?.metadata[0].total,
				dataGroups: res.data.groups[0].data?.map((item: any, index: number) => {
					return {
						...item,
						index: index + 1,
					};
				}),
			});
			setSpinValues(false);
			setIsSpin(false);
		} catch (error) {
			setIsSpin(false);
			setSpinValues(false);
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

	const columns: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			width: '5%',
			className: 'text-center',
		},

		{
			title: 'ID',
			dataIndex: '_id',

			key: '_id',
		},
		{
			title: 'NAME',
			dataIndex: 'name',

			key: 'name',
		},
		{
			title: 'STATUS',
			dataIndex: 'status',

			key: 'status',
			className: 'text-center',
			render: record => {
				return record?.charAt(0).toUpperCase() + record?.slice(1);
			},
		},
		{
			title: 'GROUP USERS',
			dataIndex: 'group_users',
			key: 'group_users',
			render: (_, item) => {
				return (
					<>
						<Button
							style={{ backgroundColor: '#13ae81', border: '#13ae81' }}
							type="primary"
							size="middle"
							onClick={() => showModal(item)}
						>
							View More
						</Button>
					</>
				);
			},
			className: 'text-center',
		},
	];

	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setIsSpin(true);
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListGroup({
			...objParams,
			page: current - 1,
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
		getDataListGroup({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 0 });
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: e.target.value,
			page: `0`,
			size: `10`,
		});
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

				<div className="flex items-center justify-between  xl:min-w-max sm:flex-col">
					<div className="flex justify-between items-center md:flex-col md:items-start     sm:items-start w-full mb-4 sm:mb-2">
						<div className="w-1/3 min-w-[220px] md:w-full xl:w-2/3  my-3 sm:my-4 mr-3 xl:mr-0 flex items-center">
							<Input
								placeholder="Find groups by..."
								onChange={e => handleChange(e)}
								onKeyDown={handleEnterSearch}
							/>
							<Button type="primary" style={{ backgroundColor: '#13ae81', border: '#13ae81' }}>
								<div className="flex items-center" onClick={handleClickSearch}>
									<i className="bx bx-search text-base mr-1"></i>
									<span>Search</span>
								</div>
							</Button>
						</div>

						<div className=" h-full ml-1 md:w-30 sm:w-full ">
							<p className="mb-0 sm:my-2 sm:float-left  w-full inline-block  font-semibold">
								Total : {blockDataGroups?.lengthUser | 0} Groups
							</p>
						</div>
					</div>
				</div>
				<div className="overflow-hidden">
					{isSpin ? (
						<div className="w-full h-[30vh] flex justify-center items-center">
							<Spin
								indicator={<LoadingOutlined style={{ fontSize: 32, color: '#13ae81' }} spin={isSpin} />}
							/>
						</div>
					) : (
						<>
							<Table
								bordered
								columns={columns}
								scroll={{ x: 'max-content' }}
								dataSource={blockDataGroups?.dataGroups}
								pagination={false}
								locale={{
									emptyText: (
										<>
											{spinValues ? (
												<Spin indicator={antIcon} spinning={spinValues} />
											) : (
												<span className="italic font-medium  text-center">No data</span>
											)}
										</>
									),
								}}
							/>
							<div className="flex justify-end mt-3 ">
								<Pagination
									current={numberPage}
									showSizeChanger
									defaultCurrent={1}
									pageSize={numberLimit}
									total={blockDataGroups?.lengthUser}
									onChange={onShowSizeChange}
									locale={{ items_per_page: ' Groups per page' }}
								/>
							</div>
						</>
					)}
				</div>
			</div>
			<PopupGroup isModalOpen={isModalOpen} dataItem={dataItem} handleOk={handleOk} handleCancel={handleCancel} />
		</>
	);
}
