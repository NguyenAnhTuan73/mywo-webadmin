import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, Pagination, Input, Select, Button, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import _debounce from 'lodash/debounce';
import { DataType } from '../../interface/list-user/list_user.interface';
import { getListDevice, getSelectToFilter } from '../../service/user/UserService';
import { TypeDataDevices } from '../../interface/manage.interface';
const { Option } = Select;
import './ListDevice.scss';
import { getAccessToken } from '../../helper/tokenHelper';

export default function ListDevices() {
	const [isSpin, setIsSpin] = useState(true);
	const [spinValues, setSpinValues] = useState(false);
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [appVersion, setAppVersion] = useState<any>();
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [blockDataDevices, setBlockDataDevices] = useState<any>({ lengthUser: 0, dataDevices: [] });

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
	});
	const params = new URLSearchParams(location.search);
	const searchValue = params.get('search') == null ? '' : params.get('search');
	const pageValue = params.get('page') == null ? 1 : params.get('page');
	const sizeValue = params.get('size') == null ? 10 : params.get('size');
	const [objParams, setObjParams] = useState({
		search: searchValue,
		page: pageValue,
		size: sizeValue,
	});
	// lodash

	const getAppVersion = async () => {
		const param = ['app_version'];
		const dataAppVersion = await getSelectToFilter(param);

		setAppVersion(dataAppVersion.data?.results?.app_version);
	};
	//loading....
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		getAppVersion();
		getDataListDevice(objParams);
	}, [getAccessToken()]);
	const getDataListDevice = async (objData: any) => {
		try {
			setSpinValues(true);
			setObjParams(objData);
			const res = await getListDevice(objData);

			setIsSpin(false);
			setBlockDataDevices({
				lengthUser: res.data.devices.total,
				dataDevices: res.data.devices.docs?.map((item: TypeDataDevices, index: number) => {
					return {
						...item,
						index: index + 1 + (objData.page - 1) * numberLimit,
					};
				}),
			});
			setSpinValues(false);
		} catch (error) {
			setIsSpin(false);
			setSpinValues(false);
		}
	};

	// filer when select app version
	const handleChangeSelectAppVersion = async (e: any) => {
		await getDataListDevice({
			...objParams,
			page: 1,
		});
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			page: `${numberPage}`,
			size: `${numberLimit}`,
			app_version: e,
		});
	};
	const columns: ColumnsType<DataType> = [
		{
			title: 'NO.',
			dataIndex: 'index',
			key: 'index',
			width: '4%',
			className: 'text-center',
		},
		{
			title: 'DEVICE ID',
			dataIndex: 'user_id',
			key: 'user_id',
		},
		{
			title: 'DEVICE MODEL',
			dataIndex: 'device_model',
			key: 'device_model',
		},

		{
			title: 'LANGUAGE',
			key: 'language',
			dataIndex: 'language',
			className: 'text-center',
			width: '10%',
		},
		{
			title: 'CURRENCY',
			key: 'currency',
			dataIndex: 'currency',
			width: '10%',
			className: 'text-center',
		},
		{
			title: 'APP VERSION',
			key: 'app_version',
			dataIndex: 'app_version',

			className: 'text-center',
		},
		{
			title: 'OS VERSION',
			key: 'os_version',
			dataIndex: 'os_version',
			className: 'text-center',
		},

		// {
		// 	title: 'FIRST NAME',
		// 	key: 'first_name',
		// 	dataIndex: 'first_name',
		// 	width: '10%',
		// },
		// {
		// 	title: 'LAST NAME',
		// 	key: 'last_name',
		// 	dataIndex: 'last_name',
		// 	width: '10%',
		// },
	];

	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListDevice({
			...objParams,
			page: current,
			size: pageSize,
		});
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: current.toString(),
			size: pageSize.toString(),
			// status: statusActive,
		});
	};

	const renderBlockDataDevices = blockDataDevices.dataDevices.map((item: TypeDataDevices) => {
		return {
			user_id: item?._id,
			device_id: item?.device_id,
			device_model: item?.device_model,
			app_version: item?.app_version,
			os_version: item?.os_version,
			language: item?.language?.toUpperCase(),
			currency: item?.currency,
			first_name: item.user[0]?.first_name,
			last_name: item.user[0]?.last_name,
			index: item?.index,
		};
	});

	// click seach
	const handleClickSearch = (e: any) => {
		setIsSpin(true);
		setFilterSearch(e.target.value);
		getDataListDevice({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 1 });
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: e.target.value,
			page: `1`,
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
		// <div className="md:overflow-y-auto">
		<div className="">
			<h1 className="text-base font-bold">DEVICES LIST</h1>

			<div className="flex items-center justify-between  xl:min-w-max sm:flex-col">
				<div className="flex justify-between items-center md:flex-col md:items-start     sm:items-start w-full mb-4 sm:mb-2">
					<div className="w-1/3 min-w-[220px] md:w-full xl:w-2/3  my-3 sm:my-4 mr-3 xl:mr-0 flex items-center">
						<Input
							placeholder="Find devices by..."
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
							Total : {blockDataDevices?.lengthUser} devices
						</p>
					</div>
				</div>
			</div>
			<div className="pr-2 w-full overflow-hidden">
				{isSpin ? (
					<div className="w-full h-full flex justify-center items-center">
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
							dataSource={renderBlockDataDevices}
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
								showSizeChanger
								current={Number(pageValue)}
								defaultCurrent={1}
								total={blockDataDevices?.lengthUser}
								onChange={onShowSizeChange}
								locale={{ items_per_page: ' Devices per page' }}
							/>
						</div>
					</>
				)}
			</div>
		</div>
		// </div>
	);
}
