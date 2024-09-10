import React, { useState, useEffect } from 'react';

import moment from 'moment';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UserOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { getDashboard, getVnpStatus, updateVnpStatus } from '../../service/user/UserService';
import { Column } from '@ant-design/plots';
import { TypeData } from '../../interface/manage.interface';
import { getAccessToken } from '../../helper/tokenHelper';
import './DashBoard.scss';

export default function DashBoard() {
	const [dashboarDisplay, setDashboarDisplay] = useState<TypeData>({
		numGroup: 0,
		numUser: 0,
		totalNewUsers: 0,
		userOfDate: [],
	});

	const [vnpStatus, setVnpStatus] = useState(false);

	const getDataDashboard = async () => {
		setIsSpin(true);
		try {
			const res = await getDashboard();

			setDashboarDisplay({
				numGroup: res.data.results.numGroup,
				numUser: res.data.results.numUser,
				totalNewUsers: res.data.results.totalNewUsers,
				userOfDate: res.data.results.userOfDate,
			});

			// const vnpStatus = await getVnpStatus();
			// console.log(vnpStatus);
			// setVnpStatus(vnpStatus.data.data.enable);

			setIsSpin(false);
		} catch (error) {
			setIsSpin(false);
		}
	};

	useEffect(() => {
		getDataDashboard();
	}, [getAccessToken()]);

	const [isSpin, setIsSpin] = useState(true);
	const result = Object.entries(dashboarDisplay.userOfDate).map(([date, value]) => {
		const [year, month, day] = date.split("-");
		return { day: `${day}-${month}`, value: value };
	});
	const data = result
	const config: any = {
		data,
		xField: 'day',
		yField: 'value',
		columnStyle: {
			width: 30, // Set the width of the columns here
		},
		label: {
			position: 'middle',
			style: {
				fill: '#FFFFFF',
				opacity: 1,
			},
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: true,
			},
		},
	};

	const handleSwitchStatus = async (status: boolean) => {
		console.log(status);
		try {
			const objParam = {
				enable: status,
			};
			const res = await updateVnpStatus(objParam);
			if (res.data.status == true) {
				if (status) {
					message.success('You just turn on Vn Pay');
				} else {
					message.success('You just turn off Vn Pay');
				}

				setVnpStatus(status);
			}
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			{isSpin ? (
				<div className=" h-screen flex justify-center items-center">
					{/* <Spin size="large" spinning={isSpin} /> */}
					<Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#13ae81' }} spin={isSpin} />} />
				</div>
			) : (
				<>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg shadow-xl">
						<h1 className="text-xl sm:text-base sm:font-semibold sm:mb-2">Analytics Dashboard</h1>
						<p>
							Manage web environment design, deployment, development and maintenance activities. Perform
							testing and quality assurance of web sites and web applications
						</p>
					</div>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg shadow-xl">
						<h1 className="text-xl sm:text-base mb-3">Portfolio Performance</h1>
						<div className="flex  sm:justify-center ">
							<div className="w-1/3 sm:w-full sm:mb-2 flex items-center sm:bock sm:text-center sm:flex-col">
								<UserOutlined className="image-dashboard mr-3 " />
								<p className="mb-0 text-[1rem]  font-medium">{dashboarDisplay.numUser} Users</p>
							</div>
							<div className="w-1/3 sm:w-full sm:mb-2 flex items-center sm:bock sm:text-center sm:flex-col">
								<HomeOutlined className="image-dashboard mr-3" />
								<p className="mb-0 text-[1rem] font-medium">{dashboarDisplay.numGroup} Groups</p>
							</div>
							<div className="w-1/3 sm:w-full flex items-center sm:bock sm:text-center sm:flex-col">
								<TeamOutlined className="image-dashboard mr-3 " />
								<p className="mb-0 text-[1rem] font-medium">{dashboarDisplay.totalNewUsers} New Users </p>
							</div>
						</div>
					</div>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg shadow-xl">
						<h1 className="text-xl sm:text-base mb-9">
							The bar chart shows the number of new users per day for the last 30 days
						</h1>
						<Column color={'#13AE81'} {...config} />
					</div>
					{/* <div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg">
						<h1 className="text-xl sm:text-base mb-9">This switch button to show on / off VNPAY</h1>
						<Space size="middle">
							<Switch
								checked={vnpStatus ? vnpStatus : false}
								onChange={() => {
									handleSwitchStatus(!vnpStatus);
								}}
							/>
						</Space>
					</div> */}
				</>
			)}
		</div>
	);
}
