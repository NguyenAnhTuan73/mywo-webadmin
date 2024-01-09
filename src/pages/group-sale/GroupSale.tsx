import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DatePickerProps } from 'antd';
import { Space, Table, Pagination, Input, Spin, Button, Modal, DatePicker, message, Select } from 'antd';
import type { PaginationProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import _debounce from 'lodash/debounce';
import _, { divide } from 'lodash';
import { addGroupSale, delGroupSaleById, getListGroupSale } from '../../service/user/UserService';
import { DataType } from '../../interface/list-user/list_user.interface';
import { getAccessToken } from '../../helper/tokenHelper';
import moment from 'moment';
import Form from 'antd/es/form';

import PopupDelGroupSale from '../popup-group-sale/PopupDelGroupSale';
import { PopupUserGroupSale } from '../popup-group-sale/PopupUserGroupSale';
import { PopupAddGroupSale } from '../popup-group-sale/PopupAddGroupSale';

export default function GroupSale() {
	const [formEdit] = Form.useForm();
	const Option = Select.Option;
	const [dataItem, setDataItem] = useState<any>(null);
	const [dataItemUser, setDataItemUser] = useState<any>(null);
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [statusButton, setStatusButton] = useState(false);
	const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
	const [isModalOpenDel, setIsModalOpenDel] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isOpenGroupSaleUser, setIsOpenGroupSaleUser] = useState(false);
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
	const [blockDataGroupSale, setBlockDataGroupSale] = useState<any>();

	const dateFormat = 'DD-MM-YYYY HH:mm:ss';

	// loading
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	useEffect(() => {
		getDataListGroupSale(objParams);
		formEdit.setFieldsValue({
			deposit_amount: dataItem?.deposit_amount,
			deposit_time: dataItem?.deposit_time,
			purchase_time: dataItem?.purchase_time,
			amount: dataItem?.amount,
			bonus: dataItem?.bonus,
			status: dataItem?.status,
			start: moment(dataItem?.start),
			start_amount: dataItem?.start_amount,
		});
	}, [dataItem, getAccessToken()]);

	const getDataListGroupSale = async (objData = objParams) => {
		try {
			setSpinValues(true);
			setObjParams(objData);
			const res = await getListGroupSale();
			setIsSpin(false);
			setBlockDataGroupSale(res.data.data);
			setSpinValues(false);
			setIsSpin(false);
		} catch (error) {
			setIsSpin(false);
		}
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			className: 'text-center',
			render: (text, object, index) => index + 1,
		},
		{
			title: 'ID',
			dataIndex: '_id',
			key: '_id',
		},
		{
			title: 'DEPOSIT AMOUNT (persons)',
			dataIndex: 'deposit_amount',
			key: 'deposit_amount',
		},
		{
			title: 'DEPOSIT TIME (hour)',
			dataIndex: 'deposit_time',
			key: 'deposit_time',
		},
		{
			title: 'PURCHASE TIME (hour)',
			dataIndex: 'purchase_time',
			key: 'purchase_time',
		},
		{
			title: 'AMOUNT (persons)',
			key: 'amount',
			dataIndex: 'amount',
			className: 'text-center',
		},
		{
			title: 'BONUS',
			dataIndex: 'bonus',
			key: 'bonus',
		},
		{
			title: 'START',
			dataIndex: 'start',
			key: 'start',
			render: (_, item) => {
				return <div>{`${moment(item?.start).format('DD-MM-YYYY HH:mm:ss')}`}</div>;
			},
		},
		{
			title: 'START AMOUNT (persons)',
			dataIndex: 'start_amount',
			key: 'start_amount',
		},
		{
			title: 'STATUS',
			key: 'status',
			dataIndex: 'status',
			className: 'text-center',
			render: (_, item) => {
				return <div>{item.status === null ? '-' : item.status}</div>;
			},
		},
		{
			title: 'GROUP SALE USER',
			key: 'groupsaleuser',
			dataIndex: 'groupsaleuser',
			className: 'text-center',
			render: (_, item) => (
				<Space size="middle">
					<Button type="primary" onClick={() => showModalGroupSaleUser(item)}>
						Show
					</Button>
				</Space>
			),
		},
		{
			title: 'EDIT',
			key: 'edit',
			dataIndex: 'edit',
			className: 'text-center',
			render: (_, item) => (
				<Space size="middle">
					<Button
						style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
						type="primary"
						danger
						onClick={() => showModalEdit(item)}
					>
						Edit
					</Button>
				</Space>
			),
		},
		{
			title: 'DELETE',
			key: 'edit',
			dataIndex: 'edit',
			className: 'text-center',
			render: (_, item) => (
				<Space size="middle">
					<Button
						style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
						type="primary"
						danger
						onClick={() => showModalDel(item)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListGroupSale({
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
	// Modal add new group sale
	const showModalAddGroupSale = () => {
		console.log('check');
		setIsModalOpen(true);
	};
	const handleCancelModalAdd = () => {
		setIsModalOpen(false);
	};
	const handleOkAddGroupSale = () => {
		setIsModalOpen(false);
	};

	// modal show group saler user
	const showModalGroupSaleUser = (item: any) => {
		setIsOpenGroupSaleUser(true);
		setDataItemUser(item?.groupsaleuser);
	};
	const handleCancelModalGroupSaleUser = () => {
		setIsOpenGroupSaleUser(false);
	};
	// modal delete
	const showModalDel = (item: any) => {
		setIsModalOpenDel(true);
		setDataItem(item);
	};
	const handleCancelModalDel = () => {
		setIsModalOpenDel(false);
		formEdit.resetFields();
	};
	const handleOkDelGroupSale = async () => {
		try {
			const res = await delGroupSaleById({ id: dataItem?._id });
			if (res) {
				message.success(res?.data?.message);
				setIsModalOpenDel(false);
				getDataListGroupSale();
			} else {
				message.error('Error');
			}
		} catch (error) {}
	};

	// modal edit group sale

	const showModalEdit = (item: any) => {
		setIsModalOpenEdit(true);
		setDataItem(item);
	};
	const handleCancelModal = () => {
		setIsModalOpenEdit(false);
		formEdit.resetFields();
	};
	const onValueChange = () => {
		const values = formEdit.getFieldsValue();

		if (
			values.amount === '' ||
			values.deposit_amount === '' ||
			values.deposit_time === '' ||
			values.purchase_time === '' ||
			values.start_amount === '' ||
			values.bonus === ''
		) {
			setStatusButton(true);
		} else {
			setStatusButton(false);
		}
	};

	const onChange: DatePickerProps['onChange'] = (date, dateString) => {
		console.log(date, dateString);
	};
	const onFinish = async (values: any) => {
		values = {
			...values,
			id: dataItem?._id,
			amount: +values.amount,
			deposit_amount: +values.deposit_amount,
			deposit_time: +values.deposit_time,
			purchase_time: +values.purchase_time,
			start_amount: +values.start_amount,
			bonus: +values.bonus,
			start: moment(values.start).subtract(7, 'h').format('YYYY-MM-DD HH:mm:ss'),
		};

		try {
			const res = await addGroupSale(values);
			if (res) {
				message.success(res.data.message);
				await getDataListGroupSale(objParams);
			}
			// formEdit.resetFields();
			setIsModalOpenEdit(false);
		} catch (error) {
			message.error('Error');
		}
	};

	return (
		<>
			<div className="">
				<h1 className="text-base font-bold">GROUP SALE LIST</h1>
				<div className="flex items-center justify-between sm:flex-col mb-5">
					<div>
						<Button onClick={() => showModalAddGroupSale()} type="primary">
							<i className="bx bx-plus"></i>Add group sale
						</Button>
					</div>
					<div className="w-full text-right">
						<p className="mb-0 font-semibold">Total : {blockDataGroupSale?.length | 0} group sale </p>
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
							dataSource={blockDataGroupSale}
							// pagination={false}
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
				{/* <div className="flex justify-end mt-3 ">
					<Pagination
						showSizeChanger
						defaultCurrent={1}
						total={blockDataGroupSale?.length}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Group sale per page' }}
					/>
				</div> */}
			</div>
			<div>
				<Modal
					forceRender
					visible={isModalOpenEdit}
					destroyOnClose={true}
					onCancel={handleCancelModal}
					footer={null}
					title={<div>EDIT GROUP SALE </div>}
				>
					<Form form={formEdit} onFinish={onFinish} layout="vertical">
						<Form.Item label={<span className="font-semibold">Deposit Amount</span>} name="deposit_amount">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Deposit Time</span>} name="deposit_time">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Purchase Time</span>} name="purchase_time">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Amount</span>} name="amount">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Bonus</span>} name="bonus">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Status</span>} name="status">
							<Select style={{ width: '50%' }} onChange={onValueChange} defaultValue={'new'}>
								<Option value="new">New</Option>
								<Option value="deposit">Deposit</Option>
								<Option value="notenough">Note Enough</Option>
								<Option value="purchase">Purchase</Option>
								<Option value="ended">Ended</Option>
							</Select>
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Start</span>} name="start">
							<DatePicker showTime format={dateFormat} onChange={onChange} />
						</Form.Item>
						<Form.Item label={<span className="font-semibold">Start Amount</span>} name="start_amount">
							<Input type="number" min={0} onChange={onValueChange} />
						</Form.Item>
						<Form.Item>
							<div className="flex justify-center mt-5">
								<Button disabled={statusButton} className="w-[10rem]" type="primary" htmlType="submit">
									Save
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Modal>
			</div>
			<div>
				<PopupAddGroupSale
					isModalOpen={isModalOpen}
					handleCancelModalAdd={handleCancelModalAdd}
					handleOkAddGroupSale={handleOkAddGroupSale}
					getDataListGroupSale={getDataListGroupSale}
				/>
			</div>
			<div>
				<PopupUserGroupSale
					isOpenGroupSaleUser={isOpenGroupSaleUser}
					handleCancelModalGroupSaleUser={handleCancelModalGroupSaleUser}
					dataItemUser={dataItemUser}
				/>
			</div>
			<div>
				<PopupDelGroupSale
					handleCancelModalDel={handleCancelModalDel}
					isModalOpenDel={isModalOpenDel}
					handleOkDelGroupSale={handleOkDelGroupSale}
				/>
			</div>
		</>
	);
}
