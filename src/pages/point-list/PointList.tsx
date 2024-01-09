import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Pagination, Input, Button, Modal, Table, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { PaginationProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { adminAddAppStoreName, adminGetAddPointFromAppStoreRate } from '../../service/auth/AuthService';
import { DataType } from '../../interface/list-user/list_user.interface';
import { TypeDataListPoint } from '../../interface/auth/auth.interface';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { TypeDataPoint } from '../../interface/manage.interface';
import { getAccessToken } from '../../helper/tokenHelper';
export const blockInvalidChar = (e: any) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

export default function PointList() {
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [statusActive, setStatusActive] = useState();
	const [currentItem, setCurrentItem] = useState<any>(null);
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [isSpin, setIsSpin] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
		status: '',
		current_plan: '',
	});
	// reload current page
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchValue = params.get('search');
	const pageValue = params.get('page') == null ? 1 : params.get('page');
	const statusValue = params.get('status');
	const planValue = params.get('current_plan');

	const [objParams, setObjParams] = useState({
		search: searchValue,
		page: pageValue,
		size: 10,
		status: statusValue !== 'undefined' ? statusValue : '',
		current_plan: planValue,
	});

	const [blockdataPointList, setBlockDataListPoint] = useState<any>({ lengthDataListAdd: 0, dataPointList: [] });
	// show add point
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [appName, setAppName] = useState('');
	const [idUser, setIdUser] = useState('');
	// lodash
	const debounceFn = useCallback(
		_debounce((value: any) => {
			setSearchParams(value);
			getDataListPointAdd(value);
		}, 500),
		[],
	);
	//loading....
	const [spinValues, setSpinValues] = useState(true);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	// filter when select of plan

	useEffect(() => {
		getDataListPointAdd(objParams);
	}, [getAccessToken()]);
	// click show modal add point

	const getDataListPointAdd = async (objData: any) => {
		try {
			setSpinValues(true);
			setObjParams(objData);

			const res = await adminGetAddPointFromAppStoreRate(objData);

			setBlockDataListPoint({
				lengthDataListAdd: res.data.points.total,
				dataPointList: res.data.points.docs?.map((item: TypeDataPoint, index: number) => {
					return {
						...item,
						point_code: item.user.point_code,
						point: item.point.point,
						name: `${item.user?.first_name} ${item.user?.last_name}`,
						email: item.user?.email,
						status: item.user?.status,
						current_plan: item.user?.current_plan,
						auth_type: item.user?.auth_type,
						index: index + 1 + (objData.page - 1) * numberLimit,
						app_store_name: item.user?.appstore_name,
					};
				}),
			});

			setSpinValues(false);
		} catch (error) {
			setSpinValues(false);
		}
	};

	const showModal = (item: any) => {
		setIsModalOpen(true);
		setCurrentItem(item);
		setIdUser(item._id);
		setAppName('');
	};

	const handleOk = async () => {
		setIsModalOpen(false);

		try {
			const onbjecData: TypeDataListPoint = {
				user_id: currentItem.user_id,
				appStoreName: appName,
			};

			if (onbjecData.appStoreName !== '' && onbjecData.appStoreName !== undefined) {
				await adminAddAppStoreName(onbjecData);
				await getDataListPointAdd(objParams);
				message.success('Update app store name success');
			} else {
				message.error('Update app store name unsuccessful');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);

		setAppName('');
	};

	// const dataShowListUser = blockdataPointList.dataPointList.map((item: any, index: number) => {});
	const columns: ColumnsType<DataType> = [
		{
			title: 'NO.',
			dataIndex: 'index',
			key: 'index',
			width: '4%',
			className: 'text-center',
		},
		{
			title: 'CODE',
			dataIndex: 'point_code',
			key: 'point_code',
			width: '5%',
		},
		{
			title: ' NAME',
			dataIndex: 'name',
			key: 'name',
			width: '15%',
		},

		{
			title: 'EMAIL',
			key: 'email',
			dataIndex: 'email',
			width: '20%',
		},
		{
			title: 'STATUS',
			dataIndex: 'status',
			key: 'status',
			width: '4%',
			render: (status, item) => {
				return <div>{status == 'active' ? 'Active' : 'Deactive'}</div>;
			},
		},
		{
			title: 'AUTH TYPE',
			key: 'auth_type',
			dataIndex: 'auth_type',
			width: '10%',
			render: (auth_type, item) => {
				return <div>{auth_type == 'google' ? 'Google' : 'Apple'}</div>;
			},
		},
		{
			title: 'APP STORE NAME',
			key: 'app_store_name',
			dataIndex: 'app_store_name',
			width: '19%',
		},
		{
			title: 'POINTS',
			key: 'point',
			dataIndex: 'point',
			className: 'text-center',
			width: '7%',
			// render: (view_points, item) => {
			// 	return <div>{item.points.length == 0 ? '0' : viewsPointUser(item)}</div>;
			// },
		},
		{
			title: 'EDIT',
			key: 'edit',
			dataIndex: 'edit',
			className: 'text-center ',
			width: '9%',
			render: (_, item) => {
				return (
					<>
						<Button type="primary" danger size="small" onClick={() => showModal(item)}>
							Edit
						</Button>
					</>
				);
			},
		},
	];

	// Filter plan in list user
	const onChangePlan: TableProps<DataType>['onChange'] = filters => {
		// console.log('params', filters);
	};
	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListPointAdd({
			...objParams,
			page: current,
			size: pageSize,
			// status :
		});
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: current.toString(),
			size: pageSize.toString(),
			status: statusActive || '',
		});
	};
	// Search
	const handleChange = (e: any) => {
		if (e.target.value === '') {
			handleClickSearch(e);
		}
		setFilterSearch(e.target.value);
	};

	const handleClickSearch = (e: any) => {
		setIsSpin(true);
		getDataListPointAdd({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 1 });
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
				<h1 className="text-base font-bold">POINT LIST</h1>

				<div className="flex items-center justify-between  md:min-w-max sm:flex-col">
					<div className="w-1/3  xl:w-full my-3 sm:my-4 mr-3 xl:mr-0 flex items center">
						<Input
							placeholder="Find user by..."
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
					<div className="w-2/3 text-right mb-4">
						<p className="mb-0 sm:my-4 sm:float-left w-full inline-block  font-semibold">
							Total : {blockdataPointList.lengthDataListAdd} user
						</p>
					</div>
				</div>
				<div className=" overflow-hidden ">
					<Table
						bordered
						columns={columns}
						scroll={{ x: 'max-content' }}
						dataSource={blockdataPointList.dataPointList}
						pagination={false}
						onChange={onChangePlan}
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
				</div>
				<div className="flex justify-end mt-3 ">
					<Pagination
						current={Number(pageValue)}
						showSizeChanger
						defaultCurrent={1}
						defaultPageSize={objParams.size}
						total={blockdataPointList.lengthDataListAdd}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Users per page' }}
					/>
				</div>
			</div>

			<Modal
				title={
					<div>
						Rename app store:{' '}
						<span className="text-red-600">
							{currentItem?.first_name} {currentItem?.last_name}
						</span>
					</div>
				}
				destroyOnClose={true}
				visible={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				className="p-2 rounded-sm"
				cancelButtonProps={{ style: { display: 'none' } }}
			>
				<Input
					type="text"
					placeholder=""
					onChange={e => {
						setAppName(e.target.value);
					}}
					defaultValue={currentItem?.app_store_name}
				/>

				<p className="mt-4 mb-0 text-md italic text-red-600">
					*Are you sure to rename app strore for this user?
				</p>
			</Modal>
		</>
	);
}
