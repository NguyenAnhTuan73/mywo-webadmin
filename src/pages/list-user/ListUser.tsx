import { useEffect, useState, useCallback } from 'react';
import { Space, Spin, Pagination, Input, Switch, Select, Button, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { PaginationProps } from 'antd';
import { useSearchParams, useLocation } from 'react-router-dom';
import moment from 'moment';
import _debounce from 'lodash/debounce';
import _, { size } from 'lodash';
import { getListUser } from '../../service/user/UserService';

import { DataType } from '../../interface/list-user/list_user.interface';
import { TypeDataAddPointUser } from '../../interface/auth/auth.interface';

const { Option } = Select;
import './ListUser.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { getAccessToken } from '../../helper/tokenHelper';
import PopupGroupUsers from '../popup-group-users/PopupGroupUsers';
import { PopupGetToken } from '../popup-get-token/PopupGetToken';
import { PopupUpdateEmail } from '../popup-update-email/PopupUpdateEmail';
import { userLoginByEmail } from '../../service/auth/AuthService';

export const blockInvalidChar = (e: any) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

export default function ListUser() {
	interface YourInterface {
		search: any;
		page: string | number | null; // Update the type here
		size: string | number | null;
	}

	const [filterSearch, setFilterSearch] = useState<string>('');
	const [dataToken, setDataToken] = useState('');
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [numberPage, setNumberPage] = useState(1);
	const [numberLimit, setNumberLimit] = useState(10);
	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		page: '',
		size: '',
	});
	// reload current page
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const searchValue = params.get('search') == null ? '' : params.get('search');
	const pageValue = params.get('page') == null ? 1 : params.get('page');
	const sizeValue = params.get('size') == null ? 10 : params.get('size');

	const [objParams, setObjParams] = useState<YourInterface>({
		search: searchValue,
		page: pageValue,
		size: sizeValue,
	});

	const [blockDataUser, setBlockDataUser] = useState<any>({ lengthUser: 0, dataUser: [] });
	const [isModalVisibleAdd, setIsModalVisibleAdd] = useState(false);

	const [idUserActive, setIdUserActive] = useState('');
	const [statusActiveUser, setStatusActiveUser] = useState('');

	// show add point
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpenToken, setIsModalOpenToken] = useState(false);
	const [isModalOpenChangeEmail, setIsModalOpenChangeEmail] = useState(false);

	const [addPoint, setAddPoint] = useState('');
	const [idUser, setIdUser] = useState('');
	const [isSpin, setIsSpin] = useState(false);
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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

	// click show modal add point
	const getDataListUser = async (objData: any) => {
		try {
			// setIsSpin(true);
			setSpinValues(true);
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
			setSpinValues(false);
			return res;
		} catch (error) {
			setIsSpin(false);
			setSpinValues(false);
		}
	};
	useEffect(() => {
		getDataListUser(objParams);
	}, [getAccessToken()]);

	const showModal = (item: any) => {
		setIsModalOpen(true);
		setCurrentUser(item);
		setIdUser(item._id);
	};

	const showModalToken = async (item: any) => {
		try {
			const resToken = await userLoginByEmail({ email: item?.email });
			setDataToken(resToken?.data);
		} catch (error) {
			setDataToken('');
		}

		setIsModalOpenToken(true);
		setCurrentUser(item);
	};

	const showModalChangeEmail = async (item: any) => {
		// try {
		// 	const resToken = await userLoginByEmail({ email: item?.email });
		// 	setDataToken(resToken?.data);
		// } catch (error) {
		// 	setDataToken('');
		// }

		setIsModalOpenChangeEmail(true);
		setCurrentUser(item);
	};

	const handleOk = async () => {
		setIsModalOpen(false);
		try {
			const onbjecData: TypeDataAddPointUser = {
				user_id: idUser,
				point: Number(addPoint),
			};

			if (onbjecData.point !== 0) {
				await getDataListUser(objParams);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};
	const handleCancelToken = () => {
		setIsModalOpenToken(false);
		setIsModalOpenChangeEmail(false);
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
			width: '8%',
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
			className: 'text-center',
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
			className: 'text-center',
		},
		{
			title: 'PLAN',
			key: 'current_plan',
			dataIndex: 'current_plan',
			width: '10%',
			className: 'text-center',
			render: (current_plan, item) => {
				return <div>{`${current_plan} ( ${moment(item.plan_expired_time).format('DD-MM-YYYY')} )`}</div>;
			},
		},

		{
			title: 'GROUP USERS',
			key: 'group_users',
			dataIndex: 'group_users',
			className: 'text-center ',
			width: '9%',
			render: (points, item) => {
				return (
					<>
						<Button
							style={{ backgroundColor: '#13ae81', border: '#13ae81' }}
							type="primary"
							size="middle"
							onClick={() => showModal(item)}
						>
							View
						</Button>
					</>
				);
			},
		},
		{
			title: 'GET TOKEN',
			key: 'get_token',
			dataIndex: 'get_token',
			className: 'text-center ',
			width: '9%',
			render: (points, item) => {
				return (
					<>
						<Button
							style={{ backgroundColor: '#13ae81', border: '#13ae81' }}
							type="primary"
							size="middle"
							onClick={() => showModalToken(item)}
						>
							Token
						</Button>
					</>
				);
			},
		},

		{
			title: 'Change Email',
			key: 'get_token',
			dataIndex: 'get_token',
			className: 'text-center ',
			width: '9%',
			render: (points, item) => {
				return (
					<>
						<Button
							style={{ backgroundColor: '#13ae81', border: '#13ae81' }}
							type="primary"
							size="middle"
							onClick={() => showModalChangeEmail(item)}
						>
							Change
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
		setSearchParams({
			...Object.fromEntries(searchParams.entries()),
			search: e.target.value,
			page: `1`,
			size: `10`,
		});
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

	return (
		<>
			<div className="">
				<h1 className="text-base font-bold">USER ACCOUNTS LIST </h1>
				<div className="flex items-center justify-between  xl:min-w-max sm:flex-col">
					<div className="flex justify-between items-center md:flex-col md:items-start     sm:items-start w-full mb-4 sm:mb-2">
						<div className="w-1/3 min-w-[220px] md:w-full xl:w-2/3  my-3 sm:my-4 mr-3 xl:mr-0 flex items-center">
							<Input
								placeholder="Find users by..."
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
								Total : {blockDataUser?.lengthUser} users
							</p>
						</div>
					</div>
				</div>
				<div className=" overflow-hidden ">
					{isSpin ? (
						<div className="w-full h-full flex justify-center items-center">
							<Spin
								indicator={<LoadingOutlined style={{ fontSize: 32, color: '#13ae81' }} spin={isSpin} />}
							/>
						</div>
					) : (
						<Table
							bordered
							columns={columns}
							scroll={{ x: 'max-content' }}
							dataSource={blockDataUser.dataUser}
							onChange={onChangePlan}
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
					)}
				</div>
				<div className="flex justify-end mt-3 ">
					<Pagination
						current={Number(pageValue)}
						showSizeChanger
						defaultCurrent={1}
						total={blockDataUser?.lengthUser}
						onChange={onShowSizeChange}
						locale={{ items_per_page: ' Users per page' }}
					/>
				</div>
			</div>

			<PopupGroupUsers
				currentUser={currentUser}
				handleOk={handleOk}
				handleCancel={handleCancel}
				isModalOpen={isModalOpen}
			/>
			<PopupGetToken
				isModalOpen={isModalOpenToken}
				handleCancel={handleCancelToken}
				currentUser={currentUser}
				dataToken={dataToken}
			/>
			<PopupUpdateEmail
				isModalOpen={isModalOpenChangeEmail}
				handleCancel={handleCancelToken}
				currentUser={currentUser}
			/>
		</>
	);
}
