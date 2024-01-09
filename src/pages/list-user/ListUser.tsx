import { useEffect, useState, useRef, useCallback } from 'react';
import { Space, Spin, Pagination, Input, Switch, Select, Button, Modal, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import moment from 'moment';
import _debounce from 'lodash/debounce';
import _ from 'lodash';
import { getListUser, activeUser, verifiedEmailUser } from '../../service/user/UserService';
import { adminAddPoint } from '../../service/auth/AuthService';
import { DataType } from '../../interface/list-user/list_user.interface';
import { TypeDataAddPointUser } from '../../interface/auth/auth.interface';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { dataActive, dataPlan, dataType, dataPoint, dataVerified } from './dataOptionActive';
import PopupAdd from '../popup-add/PopupAdd';
import PopupSend from '../popup-send/PopupSend';
const { Option } = Select;
import './ListUser.scss';

export const blockInvalidChar = (e: any) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

export default function ListUser() {
	const navigate = useNavigate();
	const typingTimeoutRef = useRef(null);
	const [filterSearch, setFilterSearch] = useState<string>('');
	const [statusActive, setStatusActive] = useState();
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
		status: '',
		verified: '',
		minimum_point: '',
		current_plan: '',
	});
	// reload current page
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchValue = params.get('search');
	const pageValue = params.get('page') == null ? 1 : params.get('page');
	const statusValue = params.get('status');
	const verifiedValue = params.get('verified');
	const planValue = params.get('current_plan');
	const typeValue = params.get('auth_type');
	const minimum_point = params.get('minimum_point');
	const [objParams, setObjParams] = useState({
		search: searchValue,
		page: pageValue,
		size: 10,
		status: statusValue !== '' && statusValue !== 'null' ? statusValue : 'active',
		verified: verifiedValue !== '' && verifiedValue !== 'null' ? verifiedValue : 'all',
		minimum_point: minimum_point !== '' && minimum_point !== 'null' ? minimum_point : '',
		current_plan: planValue !== '' && planValue !== 'null' ? planValue : '',
		auth_type: typeValue !== '' && typeValue !== 'null' ? typeValue : '',
	});

	const [blockDataUser, setBlockDataUser] = useState<any>({ lengthUser: 0, dataUser: [] });
	const [isModalVisibleAdd, setIsModalVisibleAdd] = useState(false);
	const [isModalVisibleVerified, setIsModalVisibleVerified] = useState(false);
	const [idUserActive, setIdUserActive] = useState('');
	const [statusActiveUser, setStatusActiveUser] = useState('');
	const [statusActiveEmail, setStatusActiveEmail] = useState(true);
	const [arrayIdUser, setArrayIdUser] = useState<any>([]);
	const [disabledCheckBoxUser, setDisbledCheckBoxUser] = useState(false);
	const [isModalVisibleSend, setIsModalVisibleSend] = useState(false);
	// show add point
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [addPoint, setAddPoint] = useState('');
	const [idUser, setIdUser] = useState('');
	const [isSpin, setIsSpin] = useState(false);

	// lodash
	const debounceFn = useCallback(
		_debounce((value: any) => {
			setSearchParams(value);
			getDataListUser(value);
		}, 500),
		[],
	);
	//loading....
	// filter when select of plan
	const handleChangeSelectType = async (e: any) => {
		await getDataListUser({
			...objParams,
			page: 1,
			auth_type: e == 'all' ? '' : e,
		});

		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: `1`,
			size: `${numberLimit}`,
			status: `${objParams.status}`,
			verified: `${objParams.verified}`,
			minimum_point: `${objParams.minimum_point}`,
			current_plan: `${objParams.current_plan}`,
			auth_type: e,
		});
	};
	const handleChangeSelectPlan = async (e: any) => {
		await getDataListUser({
			...objParams,
			page: 1,
			current_plan: e == 'all' ? '' : e,
		});

		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: `1`,
			size: `${numberLimit}`,
			status: `${objParams.status}`,
			verified: `${objParams.verified}`,
			minimum_point: `${objParams.minimum_point}`,
			current_plan: e,
			auth_type: `${objParams.auth_type}`,
		});
	};

	const handleChangeSelectVerified = async (e: any) => {
		await getDataListUser({
			...objParams,
			page: 1,
			verified: e == '' ? '' : e,
		});

		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: `1`,
			size: `${numberLimit}`,
			status: `${objParams.status}`,
			verified: e,
			minimum_point: `${objParams.minimum_point}`,
			current_plan: `${objParams.current_plan}`,
			auth_type: `${objParams.auth_type}`,
		});
	};

	const handleChangeSelectPoint = async (e: any) => {
		await getDataListUser({
			...objParams,
			page: 1,
			minimum_point: e == '' ? '' : e,
		});

		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: `1`,
			size: `${numberLimit}`,
			status: `${objParams.status}`,
			verified: `${objParams.verified}`,
			minimum_point: e,
			current_plan: `${objParams.current_plan}`,
			auth_type: `${objParams.auth_type}`,
		});
	};

	const handleChangeSelect = (e: any) => {
		setStatusActive(e);
		getDataListUser({
			...objParams,
			page: 1,
			status: e == 'all' ? '' : e,
		});

		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: filterSearch,
			page: `1`,
			size: `${numberLimit}`,
			status: e,
			verified: `${objParams.verified}`,
			minimum_point: `${objParams.minimum_point}`,
			current_plan: `${objParams.current_plan}`,
		});
	};

	// useEffect(() => {
	// 	// getDataListUser(objParams);
	// }, [getAccessToken()]);
	// click show modal add point
	const getDataListUser = async (objData: any) => {
		try {
			setIsSpin(true);
			setObjParams(objData);
			const res = await getListUser(objData);
			setIsSpin(false);

			setBlockDataUser({
				lengthUser: res?.data?.users?.total | 0,
				dataUser: res?.data?.users?.docs?.map((item: any, index: number) => {
					return {
						...item,
						send: false,
						plans: item.plans,
						index: index + 1 + (objData.page - 1) * numberLimit,
						auth_type: item.auth_type.charAt(0).toUpperCase() + item.auth_type.slice(1),
					};
				}),
			});

			setIsSpin(false);
			return res;
		} catch (error) {
			console.log(error);
			setIsSpin(false);
		}
	};

	const handleChangeSendUser = (idUser: any, check: boolean) => {
		if (check) {
			arrayIdUser.push(idUser);
		} else {
			const indexIdUser = arrayIdUser.indexOf(idUser);
			arrayIdUser.splice(indexIdUser, 1);
		}
		setArrayIdUser([...arrayIdUser]);
	};

	const onCheckAllChange = (e: CheckboxChangeEvent) => {
		let arrayToPush: any[] = [];
		let tempUser: any = blockDataUser.dataUser.map((user: any, index: any) => {
			if (e.target.checked) {
				arrayToPush.push(user['_id']);
				setDisbledCheckBoxUser(true);
				return {
					...user,
					send: true,
				};
			} else {
				setDisbledCheckBoxUser(false);
				return {
					...user,
					send: false,
				};
			}
		});
		setArrayIdUser([...arrayToPush]);
		setBlockDataUser({ ...blockDataUser, dataUser: tempUser });
	};

	const showModal = (item: any) => {
		setIsModalOpen(true);
		setCurrentUser(item);
		setIdUser(item._id);
		setAddPoint('');
	};

	const handleOk = async () => {
		setIsModalOpen(false);

		try {
			const onbjecData: TypeDataAddPointUser = {
				user_id: idUser,
				point: Number(addPoint),
			};

			if (onbjecData.point !== 0) {
				await adminAddPoint(onbjecData);
				await getDataListUser(objParams);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);

		setAddPoint('');
	};
	// total points user
	// const viewsPointUser = (item: any) => {
	//     // const filtered = item.points.filter((item: any, index: any) => item.id === index.id);
	//     const filtered = item.points.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => (v2.id === v.id)) === i)

	//     let sum = 0;
	//     for (let i = 0; i < filtered.length; i++) {
	//         if (filtered[i].is_deleted == false) {
	//             sum += filtered[i].point;
	//         }
	//     }
	//     return sum;
	// };

	// const dataShowListUser = blockDataUser.dataUser.map((item: any, index: number) => {});
	const columns: ColumnsType<DataType> = [
		{
			title: 'NO.',
			dataIndex: 'index',
			key: 'index',
			width: '5%',
			className: 'text-center',
		},
		{
			title: 'CODE',
			dataIndex: 'point_code',
			key: 'point_code',
			width: '5%',
		},
		{
			title: 'FIRST NAME',
			dataIndex: 'first_name',
			key: 'first_name',
			width: '10%',
		},

		{
			title: 'LAST NAME',
			dataIndex: 'last_name',
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
			dataIndex: 'Status',
			key: 'status',
			width: '5%',
			render: (_, record) => (
				<Space size="middle">
					<Switch
						checked={record.status === 'active'}
						onChange={() => {
							handleSwitchStatus(record['_id'], record.status);
						}}
					/>
				</Space>
			),
		},
		{
			title: 'AUTH TYPE',
			key: 'auth_type',
			dataIndex: 'auth_type',
			width: '10%',
		},
		{
			title: 'PLAN',
			key: 'current_plan',
			dataIndex: 'current_plan',
			width: '17%',
			render: (current_plan, item) => {
				return <div>{`${current_plan} ( ${moment(item.plan_expired_time).format('DD-MM-YYYY')} )`}</div>;
			},
		},
		{
			title: 'POINTS',
			key: 'points',
			dataIndex: 'points',
			width: '7%',
			render: (view_points, item) => {
				return <div>{item.points ? item.points?.total_points : 0}</div>;
			},
		},
		{
			title: 'ADD POINTS',
			key: 'add_points',
			dataIndex: 'add_points',
			className: 'text-center ',
			width: '9%',
			render: (points, item) => {
				return (
					<>
						<Button type="primary" size="small" onClick={() => showModal(item)}>
							+
						</Button>
					</>
				);
			},
		},
		{
			title: 'EMAIL',
			dataIndex: 'email_verified',
			key: 'email_verified',
			width: '5%',
			render: (email_verified, item) => (
				<Space size="middle">
					<Switch
						checked={email_verified === true}
						onChange={() => {
							handleSwitchEmailVerified(item['_id'], !email_verified);
						}}
					/>
				</Space>
			),
		},
	];
	// Filter plan in list user
	const onChangePlan: TableProps<DataType>['onChange'] = filters => {
		// console.log('params', filters);
	};
	const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
		setNumberLimit(pageSize);
		setNumberPage(current);
		getDataListUser({
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
			// status:
			// 	statusActive !== '' && statusActive !== 'null' && statusActive !== 'undefined'
			// 		? statusActive
			// 		: 'active',
		});
	};

	const handleChange = (e: any) => {
		setFilterSearch(e.target.value);
		if (e.target.value === '') {
			handleClickSearch(e);
		}
		setFilterSearch(e.target.value);
	};
	// click seach
	const handleClickSearch = (e: any) => {
		setIsSpin(true);
		getDataListUser({ ...objParams, search: e.type === 'click' ? filterSearch : e.target.value, page: 1 });
	};
	// Search
	const handleEnterSearch = (event: any) => {
		if (event.key === 'Enter') {
			handleClickSearch(event);
			return;
		}
	};

	const handleSwitchStatus = (paramsUuid: string, activeStatus: string) => {
		setIsModalVisibleAdd(true);
		setIdUserActive(paramsUuid);
		setStatusActiveUser(activeStatus);
	};

	const handleSwitchEmailVerified = (paramsUuid: string, activeStatus: boolean) => {
		setIsModalVisibleVerified(true);
		setIdUserActive(paramsUuid);
		setStatusActiveEmail(activeStatus);
	};

	const handleCancelAdd = () => {
		setIsModalVisibleAdd(false);
		setIsModalVisibleVerified(false);
	};

	const handleCancelSend = () => {
		setIsModalVisibleSend(false);
		setBlockDataUser({
			...blockDataUser,
			dataUser: blockDataUser.dataUser?.map((item: any, index: number) => {
				return {
					...item,
					send: false,
				};
			}),
		});
	};

	const handleOKAdd = async () => {
		const objParamsId = {
			user_id: idUserActive,
			status: statusActiveUser === 'active' ? 'deactivate' : 'active',
		};
		try {
			await activeUser(objParamsId);
			getDataListUser(objParams);
			setIsModalVisibleAdd(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleOKChangeEmailVerified = async () => {
		const objParamsId = {
			id: idUserActive,
		};
		try {
			await verifiedEmailUser(objParamsId);
			getDataListUser(objParams);
			setIsModalVisibleVerified(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleOKSend = (values: any) => {
		setIsModalVisibleSend(false);
	};

	return (
		<>
			<div className="">
				<h1 className="text-base font-bold">USER ACCOUNTS LIST </h1>
				<div className="flex items-center justify-between  xl:min-w-max sm:flex-col">
					<div className="flex  2xl:justify-start 2xl:flex-col 2xl:items-start items-center sm:items-start w-full mb-8">
						<div className="w-1/3 min-w-[220px] md:w-full 2xl:w-1/2  my-3 sm:my-4 mr-3 xl:mr-0 flex items-center">
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
						<div className="flex xl:flex-col md:items-start  items-center xl:justify-start xl:w-full">
							<div className="flex md:flex-col w-full justify-between">
								<div className="mr-1 xl:w-1/3 md:w-full md:mb-2 ">
									<Select
										className="xl:w-full w-[9rem]   sm:mb-4  mr-2"
										defaultValue={
											statusValue == 'active'
												? dataActive[0].title
												: statusValue == 'deactivate'
												? dataActive[1].title
												: statusValue == 'all'
												? dataActive[2].title
												: 'Filter by Status'
										}
										onChange={e => {
											handleChangeSelect(e);
										}}
									>
										{dataActive?.map((itemActive: any, index: number) => {
											return (
												<Option key={index} value={itemActive.value}>
													{itemActive.title}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="mr-1 xl:w-1/3 md:w-full md:mb-2 ">
									<Select
										className="xl:w-full w-[9rem]   sm:mb-4  mr-2"
										defaultValue={
											verifiedValue == 'verified'
												? dataVerified[0].title
												: verifiedValue == 'not'
												? dataVerified[1].title
												: verifiedValue == 'all'
												? dataVerified[2].title
												: 'Filter by verified email'
										}
										onChange={e => {
											handleChangeSelectVerified(e);
										}}
									>
										{dataVerified?.map((itemActive: any, index: number) => {
											return (
												<Option key={index} value={itemActive.value}>
													{itemActive.title}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="mr-1 xl:w-1/3 md:w-full md:mb-2 ">
									<Select
										className="xl:w-full w-[9rem]   sm:mb-4  mr-2"
										defaultValue={
											minimum_point == '5000'
												? dataPoint[0].title
												: minimum_point == '4000'
												? dataPoint[1].title
												: minimum_point == '3000'
												? dataPoint[2].title
												: minimum_point == '2000'
												? dataPoint[3].title
												: minimum_point == '1000'
												? dataPoint[4].title
												: minimum_point == '500'
												? dataPoint[5].title
												: 'Filter by point'
										}
										onChange={e => {
											handleChangeSelectPoint(e);
										}}
									>
										{dataPoint?.map((itemActive: any, index: number) => {
											return (
												<Option key={index} value={itemActive.value}>
													{itemActive.title}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="mx-1 sm:mx-0 xl:w-1/3 md:w-full md:mb-2 md:mx-0 ">
									<Select
										className="xl:w-full w-[8rem]  ml-2 sm:ml-0 sm:mb-4"
										defaultValue={
											planValue == 'basic'
												? dataPlan[0].title
												: planValue == 'premium'
												? dataPlan[1].title
												: planValue == 'advanced'
												? dataPlan[2].title
												: planValue == 'unlimited'
												? dataPlan[3].title
												: planValue == 'lifetime'
												? dataPlan[4].title
												: planValue == 'all'
												? dataPlan[5].title
												: 'Filter by Plan'
										}
										onChange={e => {
											handleChangeSelectPlan(e);
										}}
									>
										{dataPlan?.map((itemPlan: any, index: number) => {
											return (
												<Option key={index} value={itemPlan.value}>
													{itemPlan.title}
												</Option>
											);
										})}
									</Select>
								</div>
								<div className="mx-1 sm:mx-0 xl:w-1/3 md:w-full md:mb-2 md:mx-0 ">
									<Select
										className="xl:w-full w-[8rem]  ml-2 sm:ml-0 sm:mb-4"
										defaultValue={
											planValue == 'google'
												? dataType[0].title
												: planValue == 'apple'
												? dataType[1].title
												: planValue == 'facebook'
												? dataType[2].title
												: 'Filter by Type'
										}
										onChange={e => {
											handleChangeSelectType(e);
										}}
									>
										{dataType?.map((itemType: any, index: number) => {
											return (
												<Option key={index} value={itemType.value}>
													{itemType.title}
												</Option>
											);
										})}
									</Select>
								</div>
							</div>
							<div className="flex items-center xl:w-full xl:justify-start ">
								<div className="">
									<Button
										type="primary"
										className="w-50 sm:w-full  my-[0.5rem] "
										onClick={() => {
											// handleSendUser();
											navigate('/send-message');
										}}
									>
										Send Message To User
									</Button>
								</div>
								<div className="w-32 ml-1 md:w-30 sm:w-full">
									<p className="mb-0 sm:my-4 sm:float-left w-full inline-block  font-semibold">
										Total : {blockDataUser?.lengthUser}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className=" overflow-hidden ">
					{isSpin ? (
						<div className="w-full h-full flex justify-center items-center">
							<Spin size="large" spinning={isSpin} />
						</div>
					) : (
						<Table
							bordered
							columns={columns}
							scroll={{ x: 'max-content' }}
							dataSource={blockDataUser.dataUser}
							pagination={false}
							onChange={onChangePlan}
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
					)}
				</div>
				<div className="flex justify-end mt-3 ">
					<Pagination
						current={Number(pageValue)}
						showSizeChanger
						defaultCurrent={1}
						defaultPageSize={objParams.size}
						total={blockDataUser.lengthUser}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Users per page' }}
					/>
				</div>
			</div>
			<PopupAdd
				ModalVisibleAdd={isModalVisibleAdd}
				handleCancelAdd={handleCancelAdd}
				handleOKAdd={handleOKAdd}
				statusActiveUser={statusActiveUser}
			/>

			<PopupAdd
				ModalVisibleAdd={isModalVisibleVerified}
				handleCancelAdd={handleCancelAdd}
				handleOKAdd={handleOKChangeEmailVerified}
				statusActiveUser={statusActiveEmail}
			/>

			<PopupSend
				isModalVisibleSend={isModalVisibleSend}
				handleCancelSend={handleCancelSend}
				handleOKSend={handleOKSend}
				arrayIdUser={arrayIdUser}
			/>

			<Modal
				title={
					<div>
						Add points to:{' '}
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
			>
				<Input
					type="number"
					placeholder="Add points"
					onKeyDown={blockInvalidChar}
					onChange={e => {
						setAddPoint(e.target.value.replace(/^\d*\D/g, '').replace(/^0/, ''));
					}}
					value={addPoint}
				/>

				<p className="mt-4 mb-0 text-md italic text-red-600">*Are you sure to add points for this user?</p>
			</Modal>
		</>
	);
}
