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
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [appVersion, setAppVersion] = useState<any>();
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [blockDataDevices, setBlockDataDevices] = useState<any>({ lengthUser: 0, dataDevices: [] });

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
		app_version: '',
	});
	const [objParams, setObjParams] = useState({
		search: '',
		page: 1,
		size: 10,
		app_version: '',
	});
	// lodash

	const getAppVersion = async () => {
		const param = ['app_version'];
		const dataAppVersion = await getSelectToFilter(param);

		setAppVersion(dataAppVersion.data.results.app_version);
	};
	//loading....
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
	useEffect(() => {
		getAppVersion();
		getDataListDevice(objParams);
	}, [getAccessToken()]);
	const getDataListDevice = async (objData = objParams) => {
		try {
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
		} catch (error) {
			setIsSpin(false);
		}
	};

	// filer when select app version
	const handleChangeSelectAppVersion = async (e: any) => {
		await getDataListDevice({
			...objParams,
			page: 1,
			app_version: e,
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
			title: 'DEVICE MODEL',
			dataIndex: 'device_model',
			key: 'device_model',
			width: '16%',
		},
		{
			title: 'DEVICE ID',
			dataIndex: 'device_id',
			key: 'device_id',
			width: '28%',
		},

		{
			title: 'LANGUAGE',
			key: 'language',
			dataIndex: 'language',
			width: '5%',
			className: 'text-center',
		},
		{
			title: 'CURRENCY',
			key: 'currency',
			dataIndex: 'currency',
			width: '8%',
			className: 'text-center',
		},
		{
			title: 'APP VERSION',
			key: 'app_version',
			dataIndex: 'app_version',
			width: '10%',
			className: 'text-center',
		},
		{
			title: 'OS VERSION',
			key: 'os_version',
			dataIndex: 'os_version',
			width: '9%',
			className: 'text-center',
		},

		{
			title: 'FIRST NAME',
			key: 'first_name',
			dataIndex: 'first_name',
			width: '10%',
		},
		{
			title: 'LAST NAME',
			key: 'last_name',
			dataIndex: 'last_name',
			width: '10%',
		},
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
			user_id: item?.user_id,
			device_id: item?.device_id,
			device_model: item?.device_model,
			app_version: item?.app_version,
			os_version: item?.os_version,
			language: item?.language,
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
			<div className="flex items-center justify-between sm:flex-col">
				<div className="w-1/3 min-w-[220px]  xl:w-full my-3 sm:my-4 mr-3  flex items center">
					<Input
						placeholder="Find devices model..."
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
				<Select
					className="sm:w-full w-[8rem] ml-2 sm:ml-0 sm:mb-4 "
					style={{ marginRight: '10px' }}
					defaultValue={'All Version'}
					onChange={e => {
						handleChangeSelectAppVersion(e);
					}}
				>
					<Option key={''} value={''}>
						{'All Version'}
					</Option>
					{appVersion?.map((itemVersion: string, index: number) => {
						return (
							<>
								<Option key={index} value={itemVersion}>
									{itemVersion}
								</Option>
							</>
						);
					})}
				</Select>

				<div className="w-40 mr-3 md:w-30 sm:w-full sm:mb-2">
					<p className="mb-0 font-semibold">Total : {blockDataDevices.lengthUser} users</p>
				</div>
			</div>
			<div className="pr-2 w-full overflow-hidden">
				{isSpin ? (
					<div className="w-full h-full flex justify-center items-center">
						<Spin size="large" spinning={isSpin} />
					</div>
				) : (
					<Table
						bordered
						columns={columns}
						scroll={{ x: 'max-content' }}
						dataSource={renderBlockDataDevices}
						pagination={false}
					/>
				)}
			</div>

			<div className="flex justify-end mt-3 ">
				<Pagination
					showSizeChanger
					defaultCurrent={1}
					total={blockDataDevices.lengthUser}
					onChange={onShowSizeChange}
					locale={{ items_per_page: ' Devices per page' }}
				/>
			</div>
		</div>
		// </div>
	);
}
